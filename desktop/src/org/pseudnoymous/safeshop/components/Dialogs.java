package org.pseudnoymous.safeshop.components;

import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;

import javax.swing.JFrame;
import javax.swing.JOptionPane;

import org.pseudonymous.safeshop.Main;
import org.pseudonymous.safeshop.config.Resources;


public class Dialogs {

	public static String icon_resource = "logo";
	
	public static JFrame createBaseDialog() {
		final JFrame dialog = new JFrame(Main.applicationName);
		dialog.setLocationRelativeTo(null);
		dialog.setAutoRequestFocus(true);
		dialog.setFocusable(true);
		dialog.setIconImage(Resources.getResource(icon_resource));
		dialog.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
		dialog.addWindowListener(new WindowListener() {
			@Override
			public void windowOpened(WindowEvent e) {
			}

			@Override
			public void windowClosed(WindowEvent e) {}

			@Override
			public void windowIconified(WindowEvent e) {}

			@Override
			public void windowDeiconified(WindowEvent e) {}

			@Override
			public void windowActivated(WindowEvent e) {}

			@Override
			public void windowDeactivated(WindowEvent e) {}

			@Override
			public void windowClosing(WindowEvent e) {
				dialog.setVisible(false);
				dialog.dispose();
			}
		});
		dialog.invalidate();
		return dialog;
	}
	
	public static void BaseDialog(String title, String message, int type) {
		JOptionPane.showMessageDialog(null, message, title, type);
	}
	
	public static void ErrorDialog(String title, String message) {
		BaseDialog(title, message, JOptionPane.ERROR_MESSAGE);
	}
	
}