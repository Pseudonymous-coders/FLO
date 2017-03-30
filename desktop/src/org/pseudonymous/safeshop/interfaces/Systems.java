package org.pseudonymous.safeshop.interfaces;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.compress.archivers.ArchiveException;
import org.apache.commons.compress.archivers.ArchiveStreamFactory;
import org.apache.commons.compress.archivers.tar.TarArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;
import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveInputStream;
import org.apache.commons.compress.compressors.gzip.GzipCompressorInputStream;
import org.apache.commons.compress.utils.IOUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

public class Systems {
	public static void mkdir_p(String path) throws IOException {
		try {
			new File(path).mkdirs();
		} catch(Throwable ignored) {
			throw new IOException("Couldn't create folders");
		}
	}
	
	public static void move(File source, File destination) throws IOException {
		/*if(source.isDirectory()) {
			for(File file : source.listFiles()) {
				move(file, new File(file.getPath()));
			}
		} else {*/
			try {
				Files.move(Paths.get(source.getPath()), Paths.get(destination.getPath()), StandardCopyOption.REPLACE_EXISTING);
			} catch(Throwable ignored) {
				ignored.printStackTrace();
				throw new IOException("Couldn't move " + source.getName() + " to " + destination.getName());
			}
		//}
	}
	
	public static String getPlatform() {
		boolean is64bit = false;
		String systemArch = System.getProperty("os.arch").toLowerCase();
		String systemName = System.getProperty("os.name").toLowerCase();
		Logger.Log("System type: " + systemName + " arch: " + systemArch);
		if(systemArch.contains("64")) {
			Logger.Log("64 bit arch detected");
			is64bit = true;
		}
		
		String systemType = "i686-mingw32";
		
		if(systemName.contains("linux") && !systemName.contains("arm")) {
			if(is64bit) {
				systemType = "x86_64-pc-linux-gnu";
			} else {
				systemType = "i686-pc-linux-gnu";
			}
		} else if(systemName.contains("linux") && systemName.contains("arm")) {
			if(is64bit) {
				systemType = "aarch64-linux-gnu";
			} else {
				systemType = "arm-linux-gnueabihf";
			}
		} else if(systemName.contains("darwin")) {
			if(is64bit) {
				systemType = "x86_64-apple-darwin";
			} else {
				systemType = "i386-apple-darwin";
			}
		} else if(systemName.contains("window") || systemName.contains("cygwin")) {
			systemType = "i686-mingw32";
		}
		
		Logger.Log("Loading system type: " + systemType);
		
		return systemType;
	}
	
	public static void downloadFile(String url, String path) throws UnirestException, IOException {
		downloadFile(url, path, 0);
	}
	
	public static void downloadFile(String url, String path, int size) throws UnirestException, IOException {
		HttpResponse<InputStream> rawResponse = Unirest.get(url).header("content-type", "*/*").asBinary();
		InputStream in = rawResponse.getBody();
		FileOutputStream out = new FileOutputStream(new File(path));
		Logger.Log("Starting download from " + url);
		
		byte buffer[] = new byte[1024];
		int previousPercentage = 0;
		
		int read = 0;
		int nread = 0;
		while((read = in.read(buffer)) != -1) {
			if(size != 0) {
				int percentage = (int) (((double) (nread += read) / (double) size) * 100);
				if(percentage != previousPercentage) Logger.Log("Downloading: " + percentage + "%");
				percentage = previousPercentage;
			}
			out.write(buffer, 0, read);
		}
		in.close();
		out.close();
	}
	
	public static String sha256sum(String fileCheck) throws IOException {
		MessageDigest md;
		try {
			md = MessageDigest.getInstance("SHA-256");
		} catch (NoSuchAlgorithmException e) {
			Logger.Log("Failed loading sha algorithm!", true);
			e.printStackTrace();
			return "";
		}
		
		byte buffer[] = new byte[1024];
		
		FileInputStream in = new FileInputStream(fileCheck);
		int nread = 0;
		while((nread = in.read(buffer)) != -1) {
			md.update(buffer, 0, nread);
		}
		
		byte[] mdbytes = md.digest();
		
		StringBuffer sb = new StringBuffer();
		for(int ind = 0; ind < mdbytes.length; ind++) {
			sb.append(Integer.toString((mdbytes[ind] & 0xff) + 0x100, 16).substring(1));
		}
		
		return sb.toString();
	}
	
	public static boolean sha256compare(String fileOne, String checksum) {
		try {
			return (sha256sum(fileOne).equals(checksum));
		} catch (IOException e) {
			Logger.Log("Failed comparing SHA-256");
			e.printStackTrace();
			return false;
		}
	}
	
	public static void unZip(File zippedFile, File directory) throws IOException {
		InputStream inputStream = new FileInputStream(zippedFile);
		String headFolder = null;
		
		if(FilenameUtils.getExtension(zippedFile.toString()).contains("gz")) {
			Logger.Log("Untarring " + zippedFile.toString());
			TarArchiveInputStream in = new TarArchiveInputStream(new GzipCompressorInputStream(inputStream));
			
			TarArchiveEntry currentFile = in.getNextTarEntry();
			while(currentFile != null) {
				if(currentFile.isDirectory()) {
					Logger.Log("Unpacking directory: " + currentFile.getName());
					if(headFolder == null) headFolder = currentFile.getName();
					currentFile = in.getNextTarEntry();
					continue;
				}
				File file = new File(directory, currentFile.getName());
				File parent = file.getParentFile();
				if(!parent.exists()) {
					parent.mkdirs();
				}
				Logger.Log("Unpacking file: " + file.getName());
				OutputStream out = new FileOutputStream(file);
				IOUtils.copy(in, out);
				out.close();
				currentFile = in.getNextTarEntry();
			}
			in.close();
			
			Logger.Log("Closed the tar: " + zippedFile.getName());
			
			
			if(headFolder == null) {
				Logger.Log("Failed to untar " + zippedFile.getName() + " with wanted head");
			} else {
				Pattern pattern = Pattern.compile("^([a-zA-Z]+)-(.*)-(.*)");
				Matcher matcher = pattern.matcher(headFolder);
				if(matcher.find()) {		
					String match = matcher.group(1);
					
					//Custom strip method
					while(match.substring(match.length() - 1).contains("-")) {
						match = match.substring(match.length() - 1);
					}
					
					Logger.Log("Renaming unpacked archive to " + directory.getAbsolutePath() + File.separator + match);	
					File matchDir = new File(directory.getAbsolutePath() + File.separator + match);
					
					//Check to make sure that the match is actually different from the previous folder before deleting
					if(matchDir.exists() && !(matchDir.toString()).equals(headFolder)) {
						FileUtils.deleteDirectory(matchDir);
					}
					
					Systems.move(new File(directory.getAbsolutePath() + File.separator + headFolder), matchDir);
					Logger.Log("Successfully renamed");
				} else {
					Logger.Log("No version found in head folder " + headFolder);
				}
			}
			return;
		}
		
		Logger.Log("Unzipping  "  + zippedFile.toString());
		ZipArchiveInputStream in = new ZipArchiveInputStream(inputStream);
		
		Logger.Log("Opening the zip: " + zippedFile.getName());
		ZipArchiveEntry currentFile = in.getNextZipEntry();
	
		while(currentFile != null) {
			if(currentFile.isDirectory()) {
				Logger.Log("Unpacking directory: " + currentFile.getName());
				if(headFolder == null) headFolder = currentFile.getName();
				currentFile = in.getNextZipEntry();
				continue;
			}
			File file = new File(directory, currentFile.getName());
			File parent = file.getParentFile();
			if(!parent.exists()) {
				parent.mkdirs();
			}
			Logger.Log("Unpacking file: " + file.getName());
			OutputStream out = new FileOutputStream(file);
			IOUtils.copy(in, out);
			out.close();
			currentFile = in.getNextZipEntry();
		}
		
		in.close();
		Logger.Log("Closed the zip: " + zippedFile.getName());
		
		
		if(headFolder == null) {
			Logger.Log("Failed to unzip " + zippedFile.getName() + " with wanted head");
		}
	}
}
