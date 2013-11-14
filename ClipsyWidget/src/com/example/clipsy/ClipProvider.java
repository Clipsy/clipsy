package com.example.clipsy;

import java.util.Random;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.RemoteViews;

public class ClipProvider extends AppWidgetProvider {

	
  private static final String REFRESH_ACTION = "REFRESH_ACTION";

  @Override
  public void onUpdate(Context context, AppWidgetManager appWidgetManager,
      int[] appWidgetIds) {

    // Get all ids
    ComponentName thisWidget = new ComponentName(context,
    		ClipProvider.class);
    int[] allWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget);
    
    for( int i = 0 ; i < appWidgetIds.length; i++){
	    // Intent for image service 
	    Intent imageListIntent = new Intent(context, ImageListService.class);
	    imageListIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetIds[i]);
	    
	    RemoteViews rv = new RemoteViews(context.getPackageName(),R.layout.widget_layout);
	    rv.setRemoteAdapter(R.id.image_list, imageListIntent);
	    rv.setEmptyView(R.id.image_list, R.id.empty_view);
	    
	    //Refresh Intent
	    Intent refreshIntent = new Intent(context,ClipProvider.class);
	    refreshIntent.setAction(REFRESH_ACTION);
	    PendingIntent pendingIntentRefresh = PendingIntent.getBroadcast(context,0, refreshIntent, 0);
        rv.setOnClickPendingIntent(R.id.refresh, pendingIntentRefresh);
        
        //Update
        appWidgetManager.updateAppWidget(appWidgetIds[i], rv);
    }
    super.onUpdate(context, appWidgetManager, appWidgetIds);
  }
  
  @Override
  public void onReceive(Context context, Intent intent) {
          super.onReceive(context, intent);
          if(intent.getAction().equalsIgnoreCase(REFRESH_ACTION)){
                  updateWidget(context);
                  Log.i("RefreshView", "Updating view");
          }
          Log.i("RefreshView", "Refreshing view");
  }
  
  private void updateWidget(Context context) {
      AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
      int appWidgetIds[] = appWidgetManager.getAppWidgetIds(new ComponentName(context, ClipProvider.class));
      appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetIds, R.id.image_list);
  }
} 
