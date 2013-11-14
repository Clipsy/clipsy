module.exports = {
	MONGO_URL : 'mongodb://127.0.0.1:27017/clipsy',
	IMAGE_BASE_URL : 'http://localhost:4000/images',
	PYQT_SERVER_END_POINT : 'http://localhost:4000',

	NODE_SERVER : {
		HOST : 'localhost',
		PORT : process.env.PORT || 3000
	},

	PYQT_SERVER : {
		HOST : 'localhost',
		PORT : process.env.PORT || 4000
	}	
}
