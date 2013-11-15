package com.example.clipsy;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.protocol.HttpContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.example.clipsy.Clip.TYPE;

import android.util.Log;

public class ClipAsyncUtils {
	
	//private static String host = "http://169.254.135.216:3000";
	private static String host = "http://10.0.2.2:3000";
	private static String userid = "67901721";
	private static ExecutorService executorService = Executors.newFixedThreadPool(10);
	
	public static String getImageUrl(String clipId){
		Log.i("GetClips", "Getting clips");
		HttpClient httpClient = new DefaultHttpClient();
		HttpGet httpGet = new HttpGet(host+"/getclip?clipid="+clipId);
		HttpResponse response;
	    String responseString = null;
		try{
			Log.i("GetClips", "HTTP Request");
			response = httpClient.execute(httpGet);
			StatusLine statusLine = response.getStatusLine();
            if(statusLine.getStatusCode() == HttpStatus.SC_OK){
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                response.getEntity().writeTo(out);
                out.close();
                responseString = out.toString();
                Log.i("GetClips", "HTTP Response" + responseString);
            } else{
                response.getEntity().getContent().close();
                throw new IOException(statusLine.getReasonPhrase());
            }
		}catch(Exception e){
			Log.e("GetClips", "Http error",e);
		}
		return responseString;
	}
	public static List<Clip> getClips(){
			Log.i("GetClips", "Getting clips");
			HttpClient httpClient = new DefaultHttpClient();
			HttpGet httpGet = new HttpGet(host+"/getclips?userid="+userid);
			HttpResponse response;
		    String responseString = null;
			try{
				Log.i("GetClips", "HTTP Request");
				response = httpClient.execute(httpGet);
				StatusLine statusLine = response.getStatusLine();
	            if(statusLine.getStatusCode() == HttpStatus.SC_OK){
	                ByteArrayOutputStream out = new ByteArrayOutputStream();
	                response.getEntity().writeTo(out);
	                out.close();
	                responseString = out.toString();
	                Log.i("GetClips", "HTTP Response" + responseString);
	            } else{
	                response.getEntity().getContent().close();
	                throw new IOException(statusLine.getReasonPhrase());
	            }
			}catch(Exception e){
				Log.e("GetClips", "Http error",e);
			}
			JSONArray json = null;
			Log.i("GetClips", responseString);
			try {
				json = new JSONArray(responseString);
			} catch (JSONException e) {
				Log.e("GetClips","Failed to get json array",e);
				e.printStackTrace();
			}
			return toClips(json);
	}
	
	private static List<Clip> toClips(JSONArray jsonArray) {
		List<Clip> clips = new ArrayList<Clip>();
		try{
			for(int i=0;i<jsonArray.length();i++){
				try{
					JSONObject json = jsonArray.getJSONObject(i);
					Clip clip = new Clip();
					String imageUrl = String.valueOf(json.get("imageurl"));
					String imgUrl = imageUrl.replaceFirst("localhost", "10.0.2.2");
					clip.setUrl(imgUrl);
					//ImageRefreshRunnable refRunnable = new ImageRefreshRunnable(clipId, clip);
					//executorService.submit(refRunnable);
					Log.i("GetClips", "Clip url " + clip.getUrl());
					clip.setType(TYPE.IMAGE);
					json.get("screenwidth");
					json.get("top");
					json.get("left");
					json.get("width");
					json.get("clipid");
					clips.add(clip);
				}catch(Exception e){
					Log.e("GetClips", "Failed in parsing",e);
				}
			}
		}catch(Exception e){
			Log.e("GetClips", "Failed in parsing",e);
		}
		return clips;
	}
	
	/*public static List<Clip> getClips(){
		HttpClient httpClient = new DefaultHttpClient();
		HttpContext localContext = new BasicHttpContext();
		HttpPost httpPost = new HttpPost(host+"/getclips?userid="+userid);
		try {
				HttpResponse response = httpClient.execute(httpPost, localContext);
				HttpEntity entity = response.getEntity();
				te	xt = getASCIIContentFromEntity(entity);
			} catch (Exception e) {
				return e.getLocalizedMessage();
			}
		}
	private static Object getASCIIContentFromEntity(HttpEntity entity) {
		// TODO Auto-generated method stub
		return null;
	}
	}*/
	
}
