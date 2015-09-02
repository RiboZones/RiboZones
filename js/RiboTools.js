/* Ribovision 0.6 script library Ribovision.js 7:34 PM 01/07/2013 Chad R. Bernier


based on:
 *
 * Copyright (C) 2012,2013  RiboEvo, Georgia Institute of Technology, apollo.chemistry.gatech.edu
 *
 * Contact: Bernier.C.R@gatech.edu
 *
 *  This library is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Lesser General Public
 *  License as published by the Free Software Foundation; either
 *  version 2.1 of the License, or (at your option) any later version.
 *
 *  This library is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public
 *  License along with this library; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA
 *  02111-1307  USA.
 */

// for documentation see apollo.chemistry.gatech.edu/Ribovision/documentation
//This doesn't exist and this probably won't be the final license.

var DataSet=[];

$(document).ready(function () {
	prepareDropZone();
});

function prepareDropZone(){
	if(window.FileReader) { 
		var filename = '';
		var image_data = '';

		$.event.props.push('dataTransfer');
		$('.dropzone').on('dragenter', function(e){ 
			e.preventDefault();
			e.stopPropagation();
			$(this).css('background-color', 'lightBlue');
		});
		$('.dropzone').on('dragleave', function(e){ 
			$(this).css('background-color', 'white');
		});
		$('.dropzone').on('dragover', function(e){ 
			e.preventDefault();
			e.stopPropagation();
		});
		$('.dropzone').on('drop', function(e){ 
			e.stopPropagation();
			e.preventDefault();
			$(this).css('background-color', 'orange');
			var file = e.dataTransfer.files[0];
			var fileReader = new FileReader();

			var this_obj = $(this);

			fileReader.onload = (function(file) {
				return function(event) {
					// Preview
					filename = file.name;
					text_data = event.target.result;
					$(this_obj).html("<p>" + (filename) + "</p>");
					if (text_data.search(/create/) >= 0){
						//assume PML
						PML2DataSet(text_data);
						DataSet2CSV(filename);
					} else {
						//Assume CSV
						CSV2DataSet(text_data);
						DataSet2PML();
					}
				};
			})(file);

			fileReader.readAsText(file);        
		});
	} else { 
		document.getElementById('status').innerHTML = 'Your browser does not support the HTML5 FileReader.';
	}
}

function PML2DataSet(text_data){
	DataSet=[];
	text_data.replace(/create [^,]+, [^ ]+ and \([^\)]+\)\r?\ncolor [^,]+, /gm,
        function(matched, id) { 
			var MolName= matched.split(", ")[1].split(/\sand\s/)[0].split(/_/)[1].toUpperCase();
			var SeleRes = matched.split(", ")[1].split(/\(|\)/)[1].split(/resi | or resi /).slice(1);
			$.each(SeleRes, function (index, value) {
				SeleRes[index] = MolName + ":(" + value + ")";
			});
			
			DataSet.push({	
				PyMOL_ObjectName : matched.split(",")[0].substr(7),
				PyMOL_Mol : matched.split(", ")[1].split(" ")[0],
				ColorCol : matched.split(", ")[1].split(" ").pop(),
				ResSele : SeleRes.join(";")
			})
		});
}
function DataSet2CSV(filename){
	var DataSetString='resNum,PyMOL_Mol,DataCol,ColorCol\r\n';
	$.each(DataSet, function (index, value){
		DataSetString += value.ResSele + "," + value.PyMOL_Mol + "," + value.PyMOL_ObjectName + "," + value.ColorCol + "\r\n"; 
	});
	var blob = new Blob([DataSetString], {type: "text/plain;charset=utf-8"});
	saveAs(blob, filename.replace(/.pml/,".csv"));
}
function CSV2DataSet(text_data){

}
function DataSet2PML(){

}