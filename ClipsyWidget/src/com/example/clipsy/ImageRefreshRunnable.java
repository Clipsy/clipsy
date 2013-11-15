package com.example.clipsy;

import android.util.Log;

public class ImageRefreshRunnable implements Runnable {

	private String clipId;
	private Clip clip;
	private String imageUrl; 
	public ImageRefreshRunnable(String clipId, Clip clip){
		this.clipId = clipId;
		this.clip = clip;
	}
	@Override
	public void run() {
		Log.i("RunnableImage", "ClipId:"+clipId);
		imageUrl = ClipAsyncUtils.getImageUrl(this.clipId);
		String imgUrl = imageUrl.replaceFirst("localhost", "10.0.2.2");
		clip.setUrl(imgUrl);
		Log.i("RunnableImage", "ClipId:"+clipId + "  "+ imageUrl);
	}
	
}
