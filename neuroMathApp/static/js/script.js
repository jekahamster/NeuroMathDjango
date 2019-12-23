$(() => {
	let url = location.href;
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");

	canvas.width = $("#canvas").width();
	canvas.height = $("#canvas").height();

	ctx.strokeStyle = "white";
	ctx.fillStyle = "white";
	ctx.lineWidth = "5";
	ctx.lineJoin = "round";

	$("#canvas").on("mousedown", (downEvent) => {
		ctx.beginPath();
		ctx.arc(downEvent.offsetX, downEvent.offsetY, ctx.lineWidth/2, 0, 2*Math.PI);
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		ctx.moveTo(downEvent.offsetX, downEvent.offsetY);
		$(this).on("mousemove", (moveEvent) => {
			ctx.lineTo(moveEvent.offsetX, moveEvent.offsetY);
			ctx.stroke();
		});
	});

	$("#canvas").on("mouseup", (upEvent) => {
		$(this).unbind("mousemove");
		ctx.closePath();
		ctx.beginPath();
		ctx.arc(upEvent.offsetX, upEvent.offsetY, ctx.lineWidth/2, 0, 2*Math.PI);
		ctx.fill();
		ctx.closePath();
	});

	$("#canvas").on("touchstart", (downEvent) => {
		let dtouches = downEvent.changedTouches;
		let dx = dtouches[0].pageX - $("#canvas").offset().left;
		let dy = dtouches[0].pageY - $("#canvas").offset().top;
		ctx.beginPath();
		ctx.arc(dx, dy, ctx.lineWidth/2, 0, 2*Math.PI);
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		ctx.moveTo(downEvent.offsetX, downEvent.offsetY);
		$(this).on("touchmove", (moveEvent) => {
			let touches = moveEvent.changedTouches;
			let x = touches[0].pageX - $("#canvas").offset().left;
			let y = touches[0].pageY - $("#canvas").offset().top;
			ctx.lineTo(x, y);
			ctx.stroke();
		});
	});

	$("#canvas").on("touchend", (upEvent) => {
		$(this).unbind("touchmove");
		let utouches = upEvent.changedTouches;
		let ux = utouches[0].pageX - $("#canvas").offset().left;
		let uy = utouches[0].pageY - $("#canvas").offset().top;
		ctx.closePath();
		ctx.beginPath();
		ctx.arc(ux, uy, ctx.lineWidth/2, 0, 2*Math.PI);
		ctx.fill();
		ctx.closePath();
	});


	$("#brush-size-input").on("mousedown", () => {
		$(this).on("mousemove", () => {
			let tempBrushSize = $("#brush-size-input").val();
			$("#brush-size-val").text(tempBrushSize);
			ctx.lineWidth = tempBrushSize;
		});
	});

	$("#brush-size-input").on("mouseup", () => {
		$(this).unbind("mousemove");
		ctx.closePath();
	});

	$("#brush-size-input").on("touchstart", () => {
		$(this).on("touchmove", () => {
			let tempBrushSize = $("#brush-size-input").val();
			$("#brush-size-val").text(tempBrushSize);
			ctx.lineWidth = tempBrushSize;
		});
	});

	$("#brush-size-input").on("touchend", () => {
		$(this).unbind("touchmove");
		ctx.closePath();
	});

	$("#brush-size-input").on("click", () => {
		let tempBrushSize = $("#brush-size-input").val();
		$("#brush-size-val").text(tempBrushSize);
		ctx.lineWidth = tempBrushSize;
	});

	$("#clear-button").on("click", () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		$("#numOut").val("");
	});

	$("#brush").click(() => {
		ctx.fillStyle = "white";
		ctx.strokeStyle = "white";
	});

	$("#lastic").click(() => {
		ctx.fillStyle = "black";
		ctx.strokeStyle = "black";
	});

	$("#doit-button").click(() => {
		let prevLineWidth = ctx.lineWidth;
		let prevStrokeStyle = ctx.strokeStyle;
		ctx.strokeStyle = "black";
		ctx.lineWidth = "2";
		
		ctx.beginPath();
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.stroke()
		ctx.closePath();
		
		ctx.strokeStyle = prevStrokeStyle;
		ctx.lineWidth = prevLineWidth;
		$("#numOut").val("Loading...");
		$.ajax({
			url: url+"recognize/",
			type: "GET",
			async: true, 
			data : ({
				"canvasURL": canvas.toDataURL(),
			}),
			success: (data) => {
				console.log(data);
				$("#numOut").val(data);
			},
			error: (data) => {
				console.log(data);
				console.log(data.responseText);
				console.log(data.statusText);
				console.log(data.status);
				alert("SERVER REQUEST ERROR! \n"+data.status+" "+data.statusText);
			},
		});
	});

	$("#adjust-button").click(() => {
		let text = $("#numOut").val();
		let prevLineWidth = ctx.lineWidth;
		let prevStrokeStyle = ctx.strokeStyle;
		ctx.strokeStyle = "black";
		ctx.lineWidth = "2";
		
		ctx.beginPath();
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.stroke()
		ctx.closePath();
		
		ctx.strokeStyle = prevStrokeStyle;
		ctx.lineWidth = prevLineWidth;
		$.ajax({
			url: url+"adjust/",
			type: "GET",
			async: true, 
			data : ({
				"canvasURL": canvas.toDataURL(),
				"text": text,
			}),
			success: (data) => {
				console.log(data);
				alert(data);
			},
			error: (data) => {
				console.log(data);
				console.log(data.responseText);
				console.log(data.statusText);
				console.log(data.status);
				alert("SERVER REQUEST ERROR! \n"+data.status+" "+data.statusText);
			},
		});

	});

	$(window).on("resize", () => {
		canvas.width = $("#canvas").width();
		canvas.height = $("#canvas").height();
	});

	$("#fullScreen").click(() => {
		fullScreen(document.getElementsByTagName("html")[0]);
	});

});

function fullScreen(element) {
	try { element.requestFullscreen(); } 
	catch (e) {}

	try { element.webkitRequestFullscreen(); }
	catch (e) {}

	try { element.mozRequestFullScreen(); }
	catch (e) {}
}