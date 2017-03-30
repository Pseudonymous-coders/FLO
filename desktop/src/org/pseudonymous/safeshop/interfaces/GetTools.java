package org.pseudonymous.safeshop.interfaces;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import com.github.zafarkhaja.semver.Version;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mashape.unirest.request.GetRequest;

public class GetTools {
	
	public static class ToolComponent {
		private String name;
		private String version;
		private String url;
		private String archiveName;
		private String fileChecksum;
		private int fileSize;
		
		public ToolComponent(String name, String version) {
			Logger.Log("Created component: " + name);
			this.name = name;
			this.version = version;
			this.url = "";
			this.fileChecksum = "";
			this.fileSize = 0;
		
		}
		
		public void setName(String name) {
			this.name = name;
		}
		
		public String getName() {
			return this.name;
		}
		
		public void setVersion(String version) {
			this.version = version;
		}
		
		public String getVersion() {
			return this.version;
		}
		
		public void setArchiveName(String name) {
			this.archiveName = name;
		}
		
		public String getArchiveName() {
			return this.archiveName;
		}
		
		public void setUrl(String url) {
			this.url = url;
		}
		
		public String getUrl() {
			return this.url;
		}
		
		public void setChecksum(String checksum) {
			this.fileChecksum = checksum;
		}
		
		public String getChecksum() {
			try {
				return this.fileChecksum.split(":")[1];
			} catch(IndexOutOfBoundsException ignored) {
				return this.fileChecksum;
			}
		}
		
		public void setArchiveSize(int size) {
			this.fileSize = size;
		}
		
		public int getArchiveSize() {
			return this.fileSize;
		}
		
		public boolean higherVersion(ToolComponent otherComponent) {
			if(Version.valueOf(this.getVersion()).greaterThan(Version.valueOf(otherComponent.getVersion()))) {
				return true;
			}
			return false;
		}
		
		public boolean sameName(ToolComponent otherComponent) {
			return this.getName().equals(otherComponent.getName());
		}
		
		public String toString() {
			return "Tool: " + this.name + "\nVersion: " + this.version + "\nUrl: " + this.url + "\nChecksum: " + this.fileChecksum;
		}
		
	}
	
	public static String toolsUrl = "http://arduino.esp8266.com/stable/package_esp8266com_index.json";
	public static String platform = "x86_64-pc-linux-gnu";
	public static String destination = "dist/";
	
	public static List<ToolComponent> loadToolList(String toolsUrl, String platform) throws UnirestException {
		List<ToolComponent> toolList = new ArrayList<ToolComponent>();
		
		GetRequest toolsGet = Unirest.get(toolsUrl);
		HttpResponse<JsonNode> toolsNode = toolsGet.asJson();
		JSONObject toolsJson = toolsNode.getBody().getObject();
		JSONArray toolsInfo = toolsJson.getJSONArray("packages")
									.getJSONObject(0)
									.getJSONArray("tools");
		
		for(int ind = 0; ind < toolsInfo.length(); ind++) {
			JSONObject toolObj = toolsInfo.getJSONObject(ind);
			JSONArray T = toolObj.getJSONArray("systems");
			
			for(int i = 0; i < T.length(); i++) {
				JSONObject cT = T.getJSONObject(i);
				if(cT.getString("host").equalsIgnoreCase(platform)) {
					ToolComponent component = new ToolComponent(toolObj.getString("name"), toolObj.getString("version"));
					component.setUrl(cT.getString("url"));
					component.setArchiveName(cT.getString("archiveFileName"));
					component.setArchiveSize(cT.getInt("size"));
					component.setChecksum(cT.getString("checksum"));
					
					boolean addTool = true;
					
					for(int pT = 0; pT < toolList.size(); pT++) {
						ToolComponent previousComponent = toolList.get(pT);
						if(component.sameName(previousComponent)) {
							Logger.Log("Found possibly new version of the tool: " + component.getName());
							if(component.higherVersion(previousComponent)) {
								Logger.Log("Found heigher version (previous): " + previousComponent.getVersion() + " (newer): " + component.getVersion());
								toolList.remove(pT);
							} else {
								Logger.Log("Keeping the same tool version: " + component.getVersion());
								addTool = false;
							}
						}
					}
					if(addTool) toolList.add(component);
				}
			}
		}
		Logger.Log("Got tools response: " + toolsInfo.toString());
		return toolList;
	}
	
	public static void downloadTools() {
		try {			
			List<GetTools.ToolComponent> components = GetTools.loadToolList(GetTools.toolsUrl, GetTools.platform);
			for(GetTools.ToolComponent component : components) {
				Logger.Log("Loading tool\n" + component.toString());
				
				try {
					String finalDestination = GetTools.destination + component.getArchiveName();
					File checkParent = new File(finalDestination);
					if(!checkParent.getParentFile().exists()) checkParent.mkdirs();
					if(checkParent.exists()) {
						Logger.Log("Archive " + component.getArchiveName() + " already downloaded!");
						continue;
					}
					
					Logger.Log("Downloading the archive: " + component.getArchiveName() + " to " + finalDestination);
					Systems.downloadFile(component.getUrl(), finalDestination, component.getArchiveSize());
					
					if(!Systems.sha256compare(finalDestination, component.getChecksum())) {
						Logger.Log("Checksum mismatch! The archive " + component.getArchiveName() + " failed to download!", true);
						continue;
					}
					Logger.Log("Done downloading " + component.getArchiveName());
					Logger.Log("Unpacking archive " + component.getArchiveName());
					try {
						Systems.unZip(checkParent, new File(GetTools.destination));
					} catch(IOException err) {
						Logger.Log("Failed unpacking archive: " + component.getArchiveName(), true);
						err.printStackTrace();
						continue;
					}
					
					Logger.Log("Done unpacking archive: " + component.getArchiveName());
				} catch (UnirestException | IOException e) {
					e.printStackTrace();
				}
			}
		} catch (UnirestException e) {
			Logger.Log("Failed downloading tools!", true);
			e.printStackTrace();
		}
	}
	
}
