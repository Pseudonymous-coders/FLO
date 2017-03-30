package org.pseudonymous.safeshop;

import org.pseudonymous.safeshop.config.Resources;
import org.pseudonymous.safeshop.interfaces.GetTools;
import org.pseudonymous.safeshop.interfaces.Logger;
import org.pseudonymous.safeshop.interfaces.Systems;

public class Main {

	public static final String applicationName = "SafeShop";
	
	public static void main(String[] args) {
		//Start the safeshop logger and load the local resources
		Logger.init();
		Resources.init();
		
		//Load the system type for future tool reference
		GetTools.platform = Systems.getPlatform();
		GetTools.downloadTools();
		
		/*try {
			Systems.unZip(new File("/home/smerkous/Downloads/httpcomponents-client-4.5.3-bin.tar.gz"), new File("/home/smerkous/Documents"));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}*/
		
		Logger.Log("Done");
	}

}
