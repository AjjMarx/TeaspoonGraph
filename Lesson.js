async function LoadLesson() {
	console.log("Lesson Loading");
	const filePath = "Sahara.json";
	try {
		const res = await fetch(filePath);
		const lessonData = await res.json();
		console.log(lessonData["Vertices"]);

		for (vert of lessonData["Vertices"]) {
			console.log(vert);
			let ph = 3.14159* (vert.Latitude)/180;
			let th = -3.14159*(vert.Longitude)/180 + 1.5707;
			points.push([Math.cos(th) * Math.cos(ph), Math.sin(th) * Math.cos(ph), Math.sin(ph), 0, 0, 0]);
		}
		for (edge of lessonData["Edges"]) {
			edges.push(edge);
		}

		requestAnimationFrame(renderGlobe);
	} catch(err) {
		console.log("Lesson data could not be loaded.");
	}
}


