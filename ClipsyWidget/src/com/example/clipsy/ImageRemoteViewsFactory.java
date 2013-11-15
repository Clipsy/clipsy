package com.example.clipsy;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Array;
import java.net.URI;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;

import com.example.clipsy.Clip.TYPE;

import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.net.Uri;
import android.util.Log;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService.RemoteViewsFactory;

public class ImageRemoteViewsFactory implements RemoteViewsFactory{

    private List<Clip> clips = new ArrayList<Clip>();
    private Context mContext;
    private int mAppWidgetId;
	
	public ImageRemoteViewsFactory(Context context, Intent intent){
		 	mContext = context;
	        mAppWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID,
	                AppWidgetManager.INVALID_APPWIDGET_ID);
		
	}
	@Override
	public int getCount() {
		return clips.size();
	}

	@Override
	public RemoteViews getLoadingView() {
		return null;
	}

	@Override
	public void onCreate() {
		Log.i("ImageFactory", "Init image");
		clips.add(new Clip("http://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Opml-icon.svg/628px-Opml-icon.svg.png", TYPE.IMAGE));
		clips.add(getListClip2());
		clips.add(new Clip("http://fc09.deviantart.net/fs70/i/2009/345/6/a/Dropbox_Icon_for_Windows_by_redwolf.jpg", TYPE.IMAGE));
		clips.add(getListClip());
		//clips.add(new Clip("http://www.hdwallpapers3d.com/wp-content/uploads/2013/05/Katrina-Kaif-Quotes-HD-wallpaper.jpg"));
		//clips.add(new Clip("http://celebs-review.com/wp-content/uploads/2013/07/katrina-kaif.jpg"));
		//clips.add(new Clip("http://www.whitegadget.com/attachments/pc-wallpapers/85835d1320729961-katrina-kaif-katrina-kaif-images.jpg"));
	}
	
	public Clip getListClip(){
		Clip clip = new Clip("data url", TYPE.LIST);
		List<String> data = new ArrayList<String>();
		data.add("Techcrunch News dom in town");
		data.add("Techcrunch News you can never be dominated");
		clip.setData(data);
		return clip;
	}
	
	public Clip getListClip2(){
		Clip clip = new Clip("data url", TYPE.LIST);
		List<String> data = new ArrayList<String>();
		data.add("Hacker News domistificationify");
		data.add("Hacker News DOMinute.in anything in two minutes");
		data.add("Hacker News happy coding all night");
		clip.setData(data);
		return clip;
	}
	public RemoteViews getViewAt(int position) {
		    Log.i("ImageFactory", "Getting image");
		    Clip clip = clips.get(position);
		    RemoteViews rv = new RemoteViews(mContext.getPackageName(), R.layout.image_item);
		    Bitmap bitmap;
		    if(clip.getType().getType().equalsIgnoreCase(TYPE.IMAGE.getType())){
		    	 bitmap = decodeSampledBitmapFromResource(clips.get(position).getUrl());
		    }else{
		    	//Create IMAGE for list of data
		    	bitmap = getListBitmap(clip);
		    }
		    if(bitmap != null){
	    		rv.setImageViewBitmap(R.id.image_item, bitmap);
	    	}
		    Log.i("ImageFactory", "Got image");
			return rv;
	}

	@Override
	public void onDataSetChanged() {
		// Make api call to get clips
		//clips.add(new Clip("http://www.hdwallpapers3d.com/wp-content/uploads/2013/05/Katrina-Kaif-Quotes-HD-wallpaper.jpg"));
		//clips.add(new Clip("http://celebs-review.com/wp-content/uploads/2013/07/katrina-kaif.jpg"));
		clips = ClipAsyncUtils.getClips();
		Log.i("ImageFactory", "data changed" + clips);
	}

	@Override
	public void onDestroy() {
		clips.clear();
	}
	
    public int getViewTypeCount() {
        return 1;
}

    public long getItemId(int position) {
        return position;
    }

    public boolean hasStableIds() {
        return true;
    }
    
    public Bitmap getListBitmap(Clip clip) {
        Paint paint = new Paint();
        paint.setTextSize(30);
        paint.setUnderlineText(true);
        //paint.setColor(textColor);
        paint.setTextAlign(Paint.Align.LEFT);
        //int width = 200;
        //it
        //int width = (int) (paint.measureText(text) + 0.5f); // round
        //float baseline = (int) (-paint.ascent() + 0.5f); // ascent() is negative
        //int height = (int) (baseline + paint.descent() + 0.5f);
        int height = 50*clip.getData().size() + 20;
        Bitmap image = Bitmap.createBitmap(600,height, Bitmap.Config.ARGB_4444);
        Canvas canvas = new Canvas(image);
        int x = 60;
        for(String text: clip.getData()){
        	Log.i("ImageFactory","Adding text bitmap, x " + text + x);
        	canvas.drawText(text, 0 , x, paint);
        	x=x+40;
        }
        return image;
    }
    private Bitmap decodeSampledBitmapFromResource(String url) {
   	 
        // First decode with inJustDecodeBounds=true to check dimensions
        final BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        InputStream inputStream;
		try {
			inputStream = getInputStream(url);
			return BitmapFactory.decodeStream(inputStream);
		} catch (IOException e) {
			Log.e("ImageFactory", "Failed to get image", e);
			return textAsBitmap("No internet connection");
		}
    }
    
    private InputStream getInputStream(String urlStr) throws IOException{
    	URL url = new URL(urlStr);
    	URLConnection urlConnection = url.openConnection();
    	InputStream in = new BufferedInputStream(urlConnection.getInputStream());
    	return in;
    }
    
    public Bitmap textAsBitmap(String text) {
        Paint paint = new Paint();
        paint.setTextSize(20);
        //paint.setColor(textColor);
        paint.setTextAlign(Paint.Align.LEFT);
     //   paint.setTextAlign(Paint.Align.CENTER);
        //int width = 200;
        //it
        //int width = (int) (paint.measureText(text) + 0.5f); // round
        //float baseline = (int) (-paint.ascent() + 0.5f); // ascent() is negative
        //int height = (int) (baseline + paint.descent() + 0.5f);
        Bitmap image = Bitmap.createBitmap(300, 200, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(image);
        canvas.drawText(text, 0, 0, paint);
        return image;
    }

}
