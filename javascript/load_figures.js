var load_figure_1 = function() {
	d3.select("#figure-div").html("");
	
	d3.select("#description").html("<b>Strain comparison</b><br>Transcription levels of all genes. Use the drop-down menus to select which strains to compare")
	
	d3.selectAll(".fig-link")
		.classed("selected", false)
	d3.select("#fig1-link").classed("selected", true)
	
	// Figure size and margin
	var w = 600; 
	var h = 500;
	var padding = 80;
	var tooltip_pad = 10;
	var margin = 60;
	var selectData = [ 	{ "text": "St1_trans"},
						{ "text": "St2_trans"},
						{ "text": "St3_trans"},
						{ "text": "St4_trans"},
						{ "text": "St5_trans"}]
	
	var name_lookup = {
		"St1_trans": "Strain 1",
	    "St2_trans": "Strain 2",
	    "St3_trans": "Strain 3",
	    "St4_trans": "Strain 4",
	    "St5_trans": "Strain 5"
	}
	
	d3.tsv("data/final_trans_data.tsv", function(dataset) {
		var body = d3.select("body");
		var dataset = dataset;
		var selectData = [ 	{ "text": "St1_trans"},
						{ "text": "St2_trans"},
						{ "text": "St3_trans"},
						{ "text": "St4_trans"},
						{ "text": "St5_trans"}] 
	  var maxX = d3.max(dataset, function(d) { if (parseFloat(d["St1_trans"])==0) {return 0.001} else {return parseFloat(d["St1_trans"]) } });
	  var minX = d3.min(dataset, function(d) { if (parseFloat(d["St1_trans"])==0) {return 0.001} else {return parseFloat(d["St1_trans"]) } });
	  var maxY = d3.max(dataset, function(d) { if (parseFloat(d["St2_trans"])==0) {return 0.001} else {return parseFloat(d["St2_trans"]) } });
	  var minY = d3.min(dataset, function(d) { if (parseFloat(d["St2_trans"])==0) {return 0.001} else {return parseFloat(d["St2_trans"]) } });

	// Select X-axis Variable
    var figure_div = d3.select("#figure-div");
	  
	var span = figure_div.append('span')
	.text('Select X-axis variable: ')
	var xInput = figure_div.append('select')
	  .attr('id','xSelect')
	  .on('change',xChange)
	  .selectAll('option')
	  .data(selectData)
	  .enter()
	  .append('option')
	  .property("selected", function(d){ return d.text == "St1_trans"; })
	  .attr('value', function (d) { return d.text })
		.text(function (d) { return name_lookup[d.text] ;})
	figure_div.append('br')
		 
	  // Select Y-axis Variable
	  var span = figure_div.append('span')
	      .text('Select Y-axis variable: ')
	  var yInput = figure_div.append('select')
	      .attr('id','ySelect')
	     .on('change',yChange)
	    .selectAll('option')
	      .data(selectData)
	      .enter()
	      .append('option')
	      .property("selected", function(d){ return d.text == "St2_trans"; })
	      .attr('value', function (d) { return d.text })
			.text(function (d) { return name_lookup[d.text] ;})
	  figure_div.append('br')
		  
 	// Defining the scales
	var xScale = d3.scaleLog()
		.domain([minX, maxX])
		.range([padding, w - padding])
		.nice();
	var yScale = d3.scaleLog()
		.domain([minY, maxY])
		.range([h - padding, padding])
		.nice();
   			
	// Defining axis
	var xAxis = d3.axisBottom() 
		.scale(xScale)
	//Define Y axis
	var yAxis = d3.axisLeft() 
		.scale(yScale)
        //.ticks(5);
	
	//Create SVG element
	var svg = figure_div
		.append("svg")
		.attr("width", w)
		.attr("height", h);
		
	/*// Add tooltip area to web page
	var tooltip = d3.select("body")
		.append("div")
	    .attr("class", "tooltip")
	    .style("opacity", .8)
		.style("background-color", "white")
		.style("position", "absolute")
		.style("border", "solid black 1px");*/
	// Define the div for the tooltip
	var div = d3.select("body").append("div")	
	    .attr("class", "tooltip")				
	    .style("opacity", 0);
   
	// X-axis
	svg.append('g')
	  .attr('class','axis')
	  .attr("transform", "translate (0, "+(h-padding) + ")")
	  .attr('id','xAxis')
	  .call(xAxis)
		
	// Y-axis
	svg.append('g')
	  .attr('class','axis')
	  .attr("transform", "translate(" + padding + ",0)")
	  .attr('id','yAxis')
	  .call(yAxis)				

    svg.append("text")
		.attr("id", "yAxisLabel")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", -h/2)
        .attr("dy", "2em")
        .style("text-anchor", "middle")
		.style("font-family", "sans-serif")
        .text("Strain 2");
		
    svg.append("text")
		.attr("id", "xAxisLabel")
        .attr("y", h-margin)
        .attr("x", w/2)
        .attr("dy", "2em")
        .style("text-anchor", "middle")
		.style("font-family", "sans-serif")
        .text("Strain 1");
		
	// Creating circles on scatter
	svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
		.attr("cx", function(d) { 
			if (parseFloat(d["St1_trans"])>=0.001) {return xScale(parseFloat(d["St1_trans"]))}
			else {return xScale(0.001)};
		})
		.attr("cy", function(d) { 
			if (parseFloat(d["St2_trans"])>=0.001) {return parseFloat(yScale(d["St2_trans"]))}
			else {return yScale(0.001)};
		})
		.attr("r", function(d) {
		return 2})
		.attr('fill', 'crimson')
		.attr("opacity", 0.5)
		.on("mouseover", function(d) {
			div.transition()
				.duration(200)
				.style("opacity", .9);
				div.html("<b>"+d["NCBI_GENE_ID"]+"</b>"+"<br/>"+ parseFloat(d["St1_trans"]).toFixed(2) 
				+ "<br/>"+ parseFloat(d["St2_trans"]).toFixed(2))
 			   	//.style("left", xScale(d["St1_trans"]) + "px")
                //.style("top", (yScale(d['St2_trans'])+200) + "px")
				.style("left", d3.event.pageX + "px")
				.style("top", d3.event.pageY + "px")
				.style("font-size", 10 + "px");
		})
		.on("mouseout", function(d) {
			div.transition()
				.duration(500)
			.style("opacity", 0);
		});
		;
		  
	    function yChange() {
	      var value = this.value // get the new y value
	      yScale // change the yScale
	        .domain([
	          d3.min(dataset, function(d) { if (parseFloat(d[value])==0) {return 0.001} else {return parseFloat(d[value]) } }),
	          d3.max(dataset, function(d) { if (parseFloat(d[value])==0) {return 0.001} else {return parseFloat(d[value]) } })
	          ])
	      yAxis.scale(yScale) // change the yScale
	      d3.select('#yAxis') // redraw the yAxis
	        .transition().duration(1000)
	        .call(yAxis)
	      d3.select('#yAxisLabel') // change the yAxisLabel
			  .text(name_lookup[value])    
	      d3.selectAll('circle') // move the circles
	        .transition().duration(1000)
	          .attr('cy',function (d) { if (parseFloat(d[value])>=0.001) {return parseFloat(yScale(d[value]))}
			else {return yScale(0.001)};
		})
	    }

	    function xChange() {
	      var value = this.value // get the new x value
	      xScale // change the xScale
	        .domain([
	          d3.min(dataset, function(d) { if (parseFloat(d[value])==0) {return 0.001} else {return parseFloat(d[value]) } }),
	          d3.max(dataset, function(d) { if (parseFloat(d[value])==0) {return 0.001} else {return parseFloat(d[value]) } })
	          ])
	      xAxis.scale(xScale) // change the xScale
	      d3.select('#xAxis') // redraw the xAxis
	        .transition().duration(1000)
	        .call(xAxis)
	      d3.select('#xAxisLabel') // change the xAxisLabel
	        .transition().duration(1000)
			  .text(name_lookup[value])
	      d3.selectAll('circle') // move the circles
	        .transition().duration(1000)
	          .attr('cx',function (d) { if (parseFloat(d[value])>=0.001) {return parseFloat(xScale(d[value]))}
			else {return xScale(0.001)};
		})
	}
    
   });
}


//
// FIGURE 2
//

var load_figure_2 = function() {
	var h = 500;
	var w = 1000;
	var margin = 60;
	
	var strain_names = ["Strain 1", "Strain 2", "Strain 3", "Strain 4", "Strain 5"]
	
	d3.select("#figure-div").html("");
	
	d3.select("#description").html("Nu er det figur 2");
	
	d3.selectAll(".fig-link")
		.classed("selected", false)
	d3.select("#fig2-link").classed("selected", true)
	
	var svg = d3.select("#figure-div").append("svg")
		.attr("height", h)
		.attr("width", w)
		.attr("id", "fig-2-svg");
	
	d3.tsv("data/long_final_transcription_w_func.tsv", function(data) {
		var dataset = data;
		for (var i = 0; i < dataset.length; i++) {
			d = dataset[i];
			d["transcription"] = parseFloat(d["transcription"])
		};
		
		var maxTrans = d3.max(dataset, function(d) { return d["transcription"] });
		var minTrans = d3.min(dataset, function(d) { return d["transcription"] });
				
		var minValue = 1e-3;
		
		var xScale = d3.scaleLinear()
			.domain([0, 6])
			.range([margin, w-margin])
			.nice()
		
		var yScale = d3.scaleLog()
			.domain([minValue/2, maxTrans])
			.range([h-margin, margin])
			.nice();
			
		var alphaScale = d3.scaleLinear()
			.domain([0, Math.max(Math.log(maxTrans), -Math.log(minValue))])
			.range([0.01, 1]);
			
		var rScale = d3.scaleLinear()
			.domain([0, Math.max(Math.log(maxTrans), -Math.log(minValue))])
			.range([2, 3.5])
		
		var strains = ["St1", "St2", "St3", "St4", "St5"];
		
		//var tooltip = d3.select("body")
		//	.append("div")
		//	.attr("class", "tooltip")
		//	.style("z-index", "10")
		//	.style("visibility", "hidden")
		
		var tooltip = d3.select("body").append("div")	
		    .attr("class", "tooltip")				
		    .style("opacity", 0);
		
		
		//svg.append("line")
		//	.attr("x1", xScale(0))
		//	.attr("x2", xScale(6))
		//	.attr("y1", yScale(1))
		//	.attr("y2", yScale(1))
		//	.attr("stroke-width", 1)
		//	.attr("stroke", "black")
		//	.attr("opacity", 0.2)
		
		svg.selectAll("circle")
			.data(dataset)
			.enter()
			.append("circle")
			.attr("class", "dot")
			.attr("id", function(d) { return d["NCBI_GENE_ID"] + d["strain"] })
			.attr("cx", function(d) { 
				var x_pos = xScale(parseInt(d["strain"]) + 0.5*(Math.random() - 0.5));
				d["x_pos"] = x_pos
				return x_pos })
			.attr("cy", function(d) { return yScale(Math.max(minValue, d["transcription"])) })
			.attr("r", function(d) { return rScale(Math.abs(Math.log(Math.max(minValue, d["transcription"])))) })
			.style("fill", "crimson")
			.attr("opacity", function(d) { return alphaScale(Math.abs(Math.log(Math.max(minValue, d["transcription"])))) })
	
		var good_dots = svg.selectAll("circle.good")
							
		svg.append("g")
			.call(d3.axisBottom().scale(xScale).ticks(5).tickFormat(""))
			//.ticks(1)
			.attr("transform", "translate(0, " + (h-margin) + ")")
	
		svg.append("g")
			.call(d3.axisLeft().scale(yScale))
			.attr("transform", "translate(" + margin + ", 0)");
			
		svg.selectAll("circle.dot").on("mouseover", function(d) {
			var gene = d["NCBI_GENE_ID"];
			var id_string = "#" + gene + "1, #" + gene + "2, #" + gene + "3, #" + gene + "4, #" + gene + "5";
			tooltip.transition()
				.duration(200)
				.style("opacity", .9);
				tooltip.html("<b>"+gene+"</b><br>" + d["function"])
			   	//.style("left", xScale(d["St1_trans"]) + "px")
	            //.style("top", (yScale(d['St2_trans'])+200) + "px")
				.style("left", d3.event.pageX + "px")
				.style("top", d3.event.pageY + "px")
				.style("font-size", 10 + "px");

			svg.selectAll("circle.dot")//.selectAll(id_string)
				.filter(function(dOther) { return d["NCBI_GENE_ID"] == dOther["NCBI_GENE_ID"] })
				.attr("r", 7)
				.style("fill", "#B0C4DE")
				.attr("opacity", 1)
		})
		
		svg.selectAll("circle.dot").on("mouseout", function(d){
			var gene = d["NCBI_GENE_ID"];
			var id_string = "#" + gene + "1, #" + gene + "2, #" + gene + "3, #" + gene + "4, #" + gene + "5";
			//tooltip.style("background-color", "red")
			tooltip.transition(200)
				.style("opacity", 0)
			svg.selectAll("circle.dot")//.selectAll(id_string)
				.filter(function(dOther) { return d["NCBI_GENE_ID"] == dOther["NCBI_GENE_ID"] })
				.style("fill", "crimson")
				.attr("r", function(d) { return rScale(Math.abs(Math.log(Math.max(minValue, d["transcription"])))) })
				.attr("opacity", function(d) { return alphaScale(Math.abs(Math.log(Math.max(minValue, d["transcription"])))) })
		})
		
	    svg.append("text")
	        .attr("transform", "rotate(-90)")
	        .attr("y", 0)
	        .attr("x", -h/2)
	        .attr("dy", "1em")
	        .style("text-anchor", "middle")
	        .text("Relative transcript level");
			
		svg.selectAll("text.xticks")
			.data(strain_names)
			.enter()
			.append("text")
			.attr("class", "xticks")
			.attr("x", function(d, i) { return xScale(i+1) })
			.attr("y", h-margin)
			.attr("dy", "1.5em")
			.attr("dx", "-1.8em")
			.text(function(d) { return d })
			.style("font-size", "16px")
		
	})
}

//
// Figure 3 ------------------------
//

var load_figure_3 = function() {
	d3.select("#figure-div").html("");
	
	d3.select("#description").html(
		"<b>Regression coefficients</b><br>"
		+ "A linear regression analysis was performed on all strains using transcription levels as predictors and a relevant fitness value as outcome. "
		+ "The regression coefficients of each gene are shown below. Error bars show the standard error of the estimates."
	);
	
	d3.selectAll(".fig-link")
		.classed("selected", false)
	d3.select("#fig3-link").classed("selected", true)
	
	var w = 600; 
	var h = 900;
	var padding = 80;
	var tooltip_pad = 10;
	
	d3.tsv("data/gene_transciptomics_coefficients.tsv", function(trans_coef) {
		  console.log(trans_coef);
		  var trans_coef_dat = trans_coef;
		  
		  var maxX = d3.max(trans_coef_dat, function(d) {return parseFloat(d["mean"]) });
		  var minX = d3.min(trans_coef_dat, function(d) {return parseFloat(d["mean"]) });
		  var maxY = d3.max(trans_coef_dat, function(d) {return parseFloat(d["stderr"]) });
		  var minY = d3.min(trans_coef_dat, function(d) {return parseFloat(d["stderr"]) });

		trans_coef_dat.sort(function(x,y) {
			return d3.ascending(parseFloat(x.mean), parseFloat(y.mean));
		})
		
	 	// Defining the scales
		var xScale = d3.scaleLinear()
			.domain([minX, maxX])
			.range([padding, w - padding])
			.nice();
		var yScale = d3.scaleLinear()
			.domain([0,trans_coef_dat.length])
			.range([h - padding, padding])
			.nice();
   
		// Defining the axes
		var xAxis = d3.axisBottom() 
			.scale(xScale);

		var yAxis = d3.axisLeft() 
			.scale(yScale);
		
		//Create SVG element
		var svg = d3.select("#figure-div")
			.append("svg")
			.attr("width", w)
			.attr("height", h);
		
		// Add the tooltip area to the webpage
		/*var tooltip = d3.select("body")
			.append("div")
		    .attr("class", "tooltip")
		    .style("opacity", .8)
			.style("background-color", "white")
			.style("position", "absolute")
			.style("border", "solid black 1px");*/
		// Define the div for the tooltip
		var div = d3.select("body").append("div")	
		    .attr("class", "tooltip")				
		    .style("opacity", 0);
		
		//Create X axis on the plot
		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate (0, "+(h-padding) + ")")
			.call(xAxis)
	  	  .append("text")
	        .attr("class", "label")
	        .attr("x", w/2)
	        .attr("y", 40)
	        .style("text-anchor", "middle")
	        .text("Regression score (mean)");
			
		svg.append("text")
			.attr("x", w/2)
			.attr("y", h-padding)
			.style("text-anchor", "middle")
			.text("Regression estimate")
			.attr("dy", "2em")
	
		//axis for D4
		/*svg.append("g")
			.call(d3.axisBottom().scale(xScale))
			.attr("transform", "translate (0, "+(h-padding) + ")");*/
	
		//Create Y axis on the plot
		/*svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + padding + ",0)")
			.call(yAxis)
	  	  .append("text")
	        .attr("class", "label")
			.attr("transform", "rotate(-90)")
	        .attr("y", -30)
			.attr("x", -h/2)
	        .style("text-anchor", "middle")
	        .text("Std. error");*/
		
			
		svg.selectAll("line")
	        .data(trans_coef_dat)
	        .enter()
			.append("line")
			.attr("x1", function(d) {
				return xScale(d['lower'])
			})
			.attr("x2", function(d){
				return xScale(d['upper'])
			})
			.attr("y1", function(d,i){
				return yScale(i)
			})
			.attr("y2", function (d,i){
				return yScale(i)
			})
			.attr('stroke-width', 0.5 + 'px')
			.attr('stroke', '#bbbbbb');
			
			
		// Creating circles on scatter
		svg.selectAll("circle")
	        .data(trans_coef_dat)
	        .enter()
	        .append("circle")
			.attr("cx", function(d) { 
				return xScale(d['mean']);
			})
			.attr("cy", function(d,i) {
				//return (h-h*0.2)-((Math.random()*(h*0.85))+1);})
				return yScale(i)
			})
			.attr("r", function(d) { 
				return 2})
			.attr('fill', 'crimson')
			.attr("opacity", 0.5)
			.on("mouseover", function(d) {
				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html("<b>"+d["NCBI_GENE_ID"]+"</b>" + "<br/> Mean: "+d3.format(".2f")(d["mean"]) 
					+"<br/> Stderr: "+d3.format(".2f")(d["stderr"]))
	 			   	.style("left", d3.event.pageX + "px")
	                .style("top", d3.event.pageY + "px")
					.style("font-size", 11 + "px");
			})
			.on("mouseout", function(d) {
				div.transition()
					.duration(500)
				.style("opacity", 0);
			});
			
			d3.select("#submitted").on("click", function(){
				var lowy = parseFloat(document.getElementById("ylow").value)
				var highy = parseFloat(document.getElementById("yhigh").value)
		      	yScale // change the yScale
		        	.domain([lowy, highy])
				yAxis.scale(yScale)
		      	d3.select('#yAxis') // redraw the yAxis
		        	.transition().duration(1000)
			    d3.selectAll('circle') // move the circles
					.data(trans_coef_dat)
					.change()
			        .transition().duration(1000)
			        .attr('cy',function (d,i) { return yScale(i)
				})
			});
   });
}