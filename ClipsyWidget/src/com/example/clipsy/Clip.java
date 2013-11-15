package com.example.clipsy;

import java.util.List;

public class Clip {
	private String url;
	private TYPE type;
	private List<String> data;

	public Clip(){
		
		
	}
	public Clip(String url, TYPE type){
		this.type = type;
		this.url = url;
	}
	
	enum TYPE{
		LIST("list"),
		IMAGE("image");
		String type;
		
		TYPE(String type){
			this.type = type;
		}
		
		public String getType(){
			return this.type;
		}
		
	}
	
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public TYPE getType() {
		return type;
	}

	public void setType(TYPE type) {
		this.type = type;
	}
	

	public List<String> getData() {
		return data;
	}

	public void setData(List<String> data) {
		this.data = data;
	}
}
