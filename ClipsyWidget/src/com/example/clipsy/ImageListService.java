package com.example.clipsy;

import android.content.Intent;
import android.widget.RemoteViewsService;
import android.widget.RemoteViewsService.RemoteViewsFactory;

public class ImageListService extends RemoteViewsService {

	 @Override
     public RemoteViewsFactory onGetViewFactory(Intent intent) {
             return new ImageRemoteViewsFactory(this.getApplicationContext(), intent);
     }
}
