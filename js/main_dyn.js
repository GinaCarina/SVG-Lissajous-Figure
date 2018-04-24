/*
Description: JS, Lissajous-Figuren
Author: Regina Leone
Version: 1.0
Tags:
*/
window.onload = function(){
	
	var run=false;		// Steuert die Animation
	var clear=true;		// loescht die vorherige Figur
	var funky=false;	// random farbige Figur, schwarzer Hintergrund
		
	var svgObj={
		Ax			:	100,	// Amplitude x
		Ay			:	100,	// Amplitude y
		
		x0			:	250,	// Figur zentrieren
		y0			:	250,	// Figur zentrieren
		
		omegaX		:	3,		// Kreisfrequenz
		omegaY		:	2,		// Kreisfrequenz
		
		phi			:	0,		// Phasenverschiebung
		
		anzahl		:	0,		// Anzahl der gezeigten Lissajous
		maxAnzahl	:	9,		// Maximale Anzahl der gezeigte Lissajous-Figuren
		
		pos			:	[0, 0],	// einzelner Punkt für das Polyline-Element

		points		:	'',		// alle Punkte für eine SVG-Polyline

		init		:	function(){
							// Höhe des SVG-Elements festlegen
							var svgWidth=$('#svg').innerWidth();
							var svgHeight=2*svgWidth/3;
							$('#svg').height(svgHeight);
		
							// Werte für x0, y0 festlegen, um Figur zu zentrieren
							this.y0=$('#svg').innerHeight()/2;
							this.x0=$('#svg').innerWidth()/2;
							
							// Für den Regler der Amplitude den maximalen Wert bestimmen
							document.getElementById("ax_regler").max=$('#svg').innerWidth()/2-20;
							document.getElementById("ay_regler").max=$('#svg').innerHeight()/2-20;
						},
		start		:	function(){
							// Frequenz auslesen,da evtl. verändert
							var x1 = $("#fx_regler").val();
							$("#fx_anzeige").html(x1);
							this.omegaX=x1;
								
							var x2 = $("#fy_regler").val();
							$("#fy_anzeige").html(x2);
							this.omegaY=x2;
							
							// Amplitude auslesen,da evtl. verändert
							var y1 = $("#ax_regler").val();
							$("#ax_anzeige").html(y1);
							this.Ax=y1;
								
							var y2 = $("#ay_regler").val();
							$("#ay_anzeige").html(y2);
							this.Ay=y2;
						},
		clear		:	function(){ //vorherige Figur/Figuren löschen
							this.anzahl++;
							if((clear)||(this.anzahl>this.maxAnzahl)){
								$("#svg").empty();
								this.anzahl=0;
							}
						},
		funky		: 	function(){ // Für den Funky-Modus, den Hintergrund und die Überschrift verändern
							if(funky){
								$("#svgContainer").removeClass("greenBackground").addClass("blackBackground");
								$("h1").addClass("funkyHeadline");
							}
							else{
								$("#svgContainer").removeClass("blackBackground").addClass("greenBackground");
								$("h1").removeClass("funkyHeadline");
							}
						},
		farbe		:	function(){	// Färbt die Lissajous-Figur/-Figuren im Funky-Modus
							if(funky){
								var r=Math.floor(Math.random()*256);
								var g=Math.floor(Math.random()*256);
								var b=Math.floor(Math.random()*256);
							}
							else{
								var r=36;
								var g=205;
								var b=168;
							}		
							return 'rgb('+r+','+g+','+b+')';
						},
		show		:	function(){	//Bestimmen der Punkte für das Polyline-Element 
							var alphaX, alphaY;	//
							
							this.phi+=Math.PI/60; //Pasenverschiebung festlegen, da sich Figur sonst nicht dreht
							this.points='';	// Punkte für ein neues SVG-Polyline-Element löschen
							
							for(var t=0;t<10;t+=0.01){ //Punkte für eine Figur festlegen
								alphaX=this.omegaX*(t)+this.phi;
								alphaY=this.omegaY*(t);
							
								this.pos[0]=this.x0+((this.Ax*Math.sin(alphaX)));
								this.pos[1]=this.y0+((this.Ay*Math.sin(alphaY)));
								this.points+=' '+this.pos;
							}
							
							// vorherige Figur/Figuren löschen
							this.clear();
							
							//Neue Figur ausgeben
							var svgNS="http://www.w3.org/2000/svg";
							var myline=document.createElementNS(svgNS,"polyline");
							myline.setAttributeNS(null,"points",this.points);
							
							myline.setAttributeNS(null,"fill","none");
							myline.setAttributeNS(null,"stroke",this.farbe());
							myline.setAttributeNS(null,"stroke-width",'3px');

							$("#svg").append(myline);		
						}
	};

	function animateLissajous(){
		// Höhe des SVG-Elements festlegen, Maximalwerte der Regler festlegen, Figuren zentrieren
		svgObj.init();
			
		// Aktuelle Werte der Regler ablesen
		svgObj.start();
		
		if(run){
			// SVG-Polyline-Elemente erstellen und anzeigen
			svgObj.show(); 
		}
		// Lissajous-Figur animieren
		requestAnimationFrame(animateLissajous);
	};
	
	animateLissajous();
		
	$("#start").click(function(){ /* Click auf Start-Button startet die Animation */	
		run=true;	
	});	
	$("#stop").click(function(){ /* Click auf Stop-Button, stoppt die Animation */
		run=false;	
	});
	$("#clear").click(function(){ /* Click auf Clear-Button löscht alle aktuellen Figuren und die Animation */
		run=false;
		clear=true;
		funky=false;
		svgObj.funky();
		svgObj.clear();
	});
	$("#more").click(function(){ /* Click auf More-Button, es werden soviele Figuren, wie unter objSVG.maxAnzahl angegeben, dargestellt */
		clear=false;
	});
	$("#funky").click(function(){ /* Click auf Funky-Button, fügt zur Farbe zur Darstellung hinzu */
		funky=true;
		svgObj.funky();
	});	
};