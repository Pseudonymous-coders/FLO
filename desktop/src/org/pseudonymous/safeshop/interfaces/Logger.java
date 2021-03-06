package org.pseudonymous.safeshop.interfaces;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Logger {

	public static class SafeShopTeePrintStream extends PrintStream {
		
		private PrintStream system_out;
		
		public SafeShopTeePrintStream(OutputStream file, PrintStream second) throws FileNotFoundException {
			super(file);
			system_out = second;
		}
		
		@Override
		public void close() {
			super.close();
		}
		
		@Override
		public void flush() {
			super.flush();
			system_out.flush();
		}
		
		@Override
		public void write(byte[] buf, int off, int len) {
			super.write(buf, off, len);
			system_out.write(buf, off, len);
		}
		
		@Override
		public void write(int b) {
			super.write(b);
			system_out.write(b);
		}
		
		@Override
		public void write(byte[] b) throws IOException{
			super.write(b);
			system_out.write(b);
		}
		
	}
	
	private static DateFormat date_format;
	private static final String log_tag = "SAFESHOP";
	
	public static void init() {
		System.out.println("Starting the safeshop logger");
	
		date_format = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss:SSS");
	}
	
	public static String getDate() {
		return date_format.format(new Date());
	}
	
	public static void Log(String toLog) {
		Log(toLog, false);
	}
	
	public static void Log(String toLog, boolean error) {
		StringBuilder sb = new StringBuilder();
		sb.append("[");
		sb.append(getDate());
		sb.append("]|");
		sb.append(log_tag);
		sb.append("|: ");
		
		if(error) {
			sb.append("(ERROR) -> ");
		}
		
		sb.append(toLog);
	
		System.out.println(sb.toString());
	}
}