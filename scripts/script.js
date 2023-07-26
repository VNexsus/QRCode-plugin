/*
 (c) VNexsus 2021-2022

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
 
(function(window, undefined){

	window.data = null;
	window.qrcode_preview = null;
	
	window.Asc.plugin.init = function(data)	{

		if(data){
			window.data = JSON.parse(data);
		}
		else{
			window.data = window.loadSettings();
		}
		window.init(window.data);

		document.getElementById("link").onkeyup = new Function("return window.generate()");
		document.getElementById("link").onchange = new Function("return window.generate()");
		document.getElementById("link").onpaste = new Function("return window.generate()");
		document.getElementById("size").oninput = new Function("return window.generate()");
		window.attachColorPicker("color");
		window.attachColorPicker("BGcolor");
		window.attachColorPicker("PCcolor");
		window.attachColorPicker("ACcolor");
		window.attachColorPicker("TLcolor");
		document.getElementById("quietZone").oninput = new Function("return window.generate()");
		document.getElementById("dotScale").oninput = new Function("return window.generate()");
		document.getElementById("bgOpacity").oninput = new Function("return window.generate()");
		document.getElementById("selectLogo").onclick = new Function("return window.selectLogo()");
		document.getElementById("uploadLogo").onchange = window.logoUploaded;
		document.getElementById("selectBackground").onclick = new Function("return window.selectBackground()");
		document.getElementById("uploadBackground").onchange = window.backgroundUploaded;

		var els = document.getElementsByName("correction");
		for (var i = 0; i < els.length; i++){
			els[i].onchange = new Function("return window.generate()");
		}
		
		window.generate();
	};

	window.generate = function() {
		document.getElementById("qrcode").innerHTML = "";
		window.data.qrcode = document.getElementById("link").value;
		window.data.color = document.getElementById("color").style.backgroundColor;
		window.data.BGcolor = document.getElementById("BGcolor").style.backgroundColor;
		window.data.PCcolor = document.getElementById("PCcolor").style.backgroundColor;
		window.data.ACcolor = document.getElementById("ACcolor").style.backgroundColor;
		window.data.TLcolor = document.getElementById("TLcolor").style.backgroundColor;
		window.data.quietZone = parseInt(document.getElementById("quietZone").value);
		document.getElementById("quietZoneValue").value = window.data.quietZone; 
		window.data.dotScale = document.getElementById("dotScale").value;
		document.getElementById("dotScaleValue").value = window.data.dotScale; 
		window.data.qrCodeSize = parseInt(document.getElementById("size").value);
		document.getElementById("sizeValue").value = window.data.qrCodeSize;
		window.data.bgOpacity = document.getElementById("bgOpacity").value;
		document.getElementById("bgOpacityValue").value = window.data.bgOpacity; 
		
		var els = document.getElementsByName("correction");
		var logo_div = 5;
		for (var i = 0; i < els.length; i++){
			if(els[i].checked){
				switch(els[i].value){
					case "L": 
						window.data.correctLevel = QRCode.CorrectLevel.L;
						break;
					case "M": 
						window.data.correctLevel = QRCode.CorrectLevel.M;
						logo_div = 4;
						break;
					case "Q": 
						window.data.correctLevel = QRCode.CorrectLevel.Q;
						logo_div = 3.8;
						break;
					case "H": 
						window.data.correctLevel = QRCode.CorrectLevel.H;
						logo_div = 3.2;
						break;
				}
			}
		}	
		if(window.data.qrcode != ""){
			window.qrcode_preview = new QRCode(document.getElementById("qrcode"), {
				text: window.data.qrcode,
				width: window.data.qrCodeSize,
				height: window.data.qrCodeSize,
				colorDark : window.data.color,
				colorLight : window.data.BGcolor,
				correctLevel : window.data.correctLevel,
				quietZone: window.data.quietZone,
				PO: window.data.PCcolor, 
				AO: window.data.ACcolor,
				timing: window.data.TLcolor,
				dotScale: Math.round(parseInt(window.data.dotScale)/10*10)/10,
				logo: window.data.logo,
				logoMaxWidth: parseInt(window.data.qrCodeSize/logo_div),
				logoMaxHeight: parseInt(window.data.qrCodeSize/logo_div),
				logoBackgroundTransparent: true,
				backgroundImage: window.data.background,
				backgroundImageAlpha: window.data.bgOpacity
			});
		}
		else{
			document.getElementById("qrcode").innerHTML = "<canvas style=\"background-color: #FCFCFC; width: "+ (window.data.qrCodeSize + window.data.quietZone*2) +"px; height: "+ (window.data.qrCodeSize + window.data.quietZone*2) +"px\"></canvas>";
		}
		window.saveSettings();
	}
	
	window.saveSettings = function() {
		if(window.localStorage && typeof(window.localStorage.setItem)){
			window.localStorage.setItem("QRCode_plugin_settings", JSON.stringify(window.data));
		}
	}
	
	window.loadSettings = function() {
		var settings = {
			qrcode: "",
			correctLevel: QRCode.CorrectLevel.M,
			color: "#000000",
			BGcolor: "#FFFFFF",
			PCcolor: "#000000",
			ACcolor: "#000000",
			TLcolor: "#000000",
			qrCodeSize: 100,
			quietZone: 10,
			dotScale: 10,
			logo: "",
			background: "",
			bgOpacity: 0.5
		};

		if(window.localStorage && typeof(window.localStorage.getItem)){
			var saved = JSON.parse(window.localStorage.getItem("QRCode_plugin_settings"));
			if(saved){
				settings.qrcode = saved.qrcode ? saved.qrcode : settings.qrcode;
				settings.correctLevel = saved.correctLevel ? saved.correctLevel : settings.correctLevel;
				settings.color = saved.color ? saved.color : settings.color;
				settings.BGcolor = saved.BGcolor ? saved.BGcolor : settings.BGcolor;
				settings.PCcolor = saved.PCcolor ? saved.PCcolor : settings.PCcolor;
				settings.ACcolor = saved.ACcolor ? saved.ACcolor : settings.ACcolor;
				settings.TLcolor = saved.TLcolor ? saved.TLcolor : settings.TLcolor;
				settings.qrCodeSize = saved.qrCodeSize ? saved.qrCodeSize : settings.qrCodeSize;
				settings.quietZone = saved.quietZone ? saved.quietZone : settings.quietZone;
				settings.dotScale = saved.dotScale ? saved.dotScale : settings.dotScale;
				settings.logo = saved.logo ? saved.logo : settings.logo;
				settings.background = saved.background ? saved.background : settings.background;
				settings.bgOpacity = saved.bgOpacity ? saved.bgOpacity : settings.bgOpacity;
			}
		}
		return settings;
	}
	
	window.init = function(data) {
		document.getElementById("link").value = data.qrcode;
		if(data.correctLevel == 1)
			document.getElementsByName("correction")[0].checked = true;
		else if(data.correctLevel == 0)
			document.getElementsByName("correction")[1].checked = true;
		else if(data.correctLevel == 3)
			document.getElementsByName("correction")[2].checked = true;
		else 
			document.getElementsByName("correction")[3].checked = true;
		document.getElementById("color").style.backgroundColor = data.color;
		document.getElementById("BGcolor").style.backgroundColor = data.BGcolor;
		document.getElementById("PCcolor").style.backgroundColor = data.PCcolor;
		document.getElementById("ACcolor").style.backgroundColor = data.ACcolor;
		document.getElementById("TLcolor").style.backgroundColor = data.TLcolor;
		document.getElementById("size").value = data.qrCodeSize;
		document.getElementById("sizeValue").value = data.qrCodeSize;
		document.getElementById("quietZone").value = data.quietZone;
		document.getElementById("quietZoneValue").value = data.quietZone;
		document.getElementById("dotScale").value = data.dotScale;
		document.getElementById("dotScaleValue").value = data.dotScale;
		if(data.logo != ""){
			document.getElementById("selectLogo").value = "Удалить";
		}
		if(data.background != ""){
			document.getElementById("selectBackground").value = "Удалить";
			document.getElementById("bgOpacity").disabled = false;
		}
		else
			document.getElementById("bgOpacity").disabled = true;
		document.getElementById("bgOpacity").value = data.bgOpacity;
		document.getElementById("bgOpacityValue").value = data.bgOpacity;
		
	}
	
	window.selectLogo = function() {
		if(document.getElementById("selectLogo").value == "Удалить"){
			window.data.logo = "";
			document.getElementById("selectLogo").value = "Выбрать"
			window.generate();
			return;
		}
		if(window["AscDesktopEditor"])
			window["AscDesktopEditor"]["OpenFilenameDialog"]("*.png", false, function(_file){
					var file = _file;
					if (Array.isArray(file)){
						file = file[0];
						window["AscDesktopEditor"]["loadLocalFile"](file,window.logoSelected)
					}
			});		
		else
			document.getElementById("uploadLogo").click();
	}
	
	window.logoSelected = function(data) {
		if(data.length > 0){
			window.data.logo = "data:image/png;base64," + window.ToBase64(data);
			document.getElementById("selectLogo").value = "Удалить"
			window.generate();
		}
	}
	
	window.logoUploaded = function(e) {
		var arrFiles = e.target.files;
		if(arrFiles.length && arrFiles.length > 0 && arrFiles[0].type && arrFiles[0].type.indexOf('image')!=-1) {
			var oFileReader = new FileReader();
			oFileReader.onloadend = function() {
				window.data.logo = oFileReader.result;
				document.getElementById("selectLogo").value = "Удалить"
				window.generate();
			}
			oFileReader.readAsDataURL(arrFiles[0]);
		}
	}

	window.selectBackground = function() {
		if(document.getElementById("selectBackground").value == "Удалить"){
			window.data.background = "";
			document.getElementById("selectBackground").value = "Выбрать"
			document.getElementById("bgOpacity").disabled = true;
			window.generate();
			return;
		}
		if(window["AscDesktopEditor"])
			window["AscDesktopEditor"]["OpenFilenameDialog"]("*.png", false, function(_file){
					var file = _file;
					if (Array.isArray(file)){
						file = file[0];
						window["AscDesktopEditor"]["loadLocalFile"](file,window.backgroundSelected)
					}
			});		
		else
			document.getElementById("uploadBackground").click();
	}

	window.backgroundSelected = function(data) {
		if(data.length > 0){
			window.data.background = "data:image/png;base64," + window.ToBase64(data);
			document.getElementById("selectBackground").value = "Удалить"
			document.getElementById("bgOpacity").disabled = false;
			window.generate();
		}
	}

	window.backgroundUploaded = function(e) {
		var arrFiles = e.target.files;
		if(arrFiles.length && arrFiles.length > 0 && arrFiles[0].type && arrFiles[0].type.indexOf('image')!=-1) {
			var oFileReader = new FileReader();
			oFileReader.onloadend = function() {
				window.data.background = oFileReader.result;
				document.getElementById("selectBackground").value = "Удалить"
				document.getElementById("bgOpacity").disabled = false;
				window.generate();
			}
			oFileReader.readAsDataURL(arrFiles[0]);
		}
	}

	window.attachColorPicker = function(ElementID) {
		const el = document.getElementById(ElementID);
		if(el){
			const pickr = new Pickr({
			  el: el,
			  useAsButton: true,
			  default: el.style.backgroundColor,
			  theme: 'nano',
			  defaultRepresentation: 'HEX',
			  autoReposition: true,
			  lockOpacity: true,
			  swatches: null,
			  position: 'bottom-start',
			  padding: 4,
			  components: {
				preview: true,
				opacity: false,
				hue: true,
				interaction: {
				  hex: false,
				  rgba: false,
				  hsva: false,
				  input: true,
				  save: false
				}
			  }
			}).on('change', color => {
			  el.style.backgroundColor = color.toHEXA().toString(0);
			  window.generate();
			})
		}
	}

	window.ToBase64 = function (u8) {
		return btoa(String.fromCharCode.apply(null, u8));
	}


	window.insertObject = function() {
		var node = document.getElementById("qrcode");
		var hasChildNodes = node.hasChildNodes();
		if(hasChildNodes){
			if(node.childNodes[0].tagName == "IMG"){
				var img_data = node.childNodes[0].src;
			}
			else{
				var img_data = node.childNodes[0].toDataURL();
			}
			var img_width = node.childNodes[0].width;
			var img_height = node.childNodes[0].height;
		}
		var info = window.Asc.plugin.info;
		var command = (info.objectId === undefined) ? "AddOleObject" : "EditOleObject";
		var data = window.data;
		var params = {
			guid : info.guid,
			widthPix : img_width,
			heightPix : img_height,
			width : (img_width) / info.mmToPx,
			height : (img_height) / info.mmToPx,
			imgSrc : img_data,
			data : JSON.stringify(data),
			objectId : info.objectId,
			resize : info.resize
		};

		window.Asc.plugin.executeMethod(command, [params], function() {
			window.Asc.plugin.executeCommand("close", "");
		});
	}

	window.Asc.plugin.button = function(id) {
 		if(id==0) {
			window.insertObject();
		}
		else
			this.executeCommand("close", "");
	};

	window.Asc.plugin.onExternalMouseUp = function() {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("mouseup", true, true, window, 1, 0, 0, 0, 0,
            false, false, false, false, 0, null);

        document.dispatchEvent(evt);
    };

})(window, undefined);
