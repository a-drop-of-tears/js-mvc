var allList=[];
var todoList=[];
var completedList=[];

function addTodo(){
	var data={"isFinish":false};
	data['todo']=document.getElementById("todoContent").value;
	document.getElementById("todoContent").value='';
	data['id']=(new Date()).getTime().toString();
	var index=indexFromArr(this.allList,data);
	if(index>-1){
		return;
	}
	this.allList.push(data);
	this.todoList.push(data);
	this.show(allList);
	this.save();
}

function show(arr){
	if(!(arr instanceof Array)){
		return;
	}
	console.log(this);
	this.showList=arr;
	console.log(this.currentCount);
	var old=document.getElementsByClassName("content")[0];
	var oldChilds=old.childNodes;
	for(var i=oldChilds.length-1;i>=0;i--){
		old.removeChild(oldChilds[i]);
	}
	this.showList.forEach(todo=>{
		var todoDiv=document.createElement("div");
		todoDiv.setAttribute("style","text-align:left;width:100%");
		todoDiv.setAttribute("ondblclick","test(this)");
		todoDiv.setAttribute("id",todo.id+"div");
		
		var checkBoxInput=document.createElement("input");
		checkBoxInput.setAttribute("type","checkbox");
		checkBoxInput.setAttribute("style","width:15px;height:15px");
		if(todo.isFinish){
			checkBoxInput.setAttribute("checked",true);
		}else{
			checkBoxInput.removeAttribute("checked");
		}
		checkBoxInput.setAttribute("onmousedown","selectCheckBox("+JSON.stringify(todo)+")");
		
		var imageDiv=document.createElement("div");
		imageDiv.setAttribute("style","float:right");
		imageDiv.setAttribute("onmousedown","deleteTodo("+JSON.stringify(todo)+")");
		
		var imageNode=document.createElement("img");
		imageNode.setAttribute("src","./img/delete.png");
		imageNode.setAttribute("style","width:20px;height:20px");
		
		var spanContent=document.createElement("span");
		spanContent.setAttribute("style","font-family:'楷体';font-size:24px");
		spanContent.innerHTML=todo.todo;
		spanContent.setAttribute("class","todoItem");
		
		imageDiv.appendChild(imageNode);
		todoDiv.appendChild(checkBoxInput);
		todoDiv.appendChild(spanContent);
		todoDiv.appendChild(imageDiv);
		document.getElementsByClassName("content")[0].appendChild(todoDiv);
	});
	updateSpan(this.showList);
}

function deleteCompleted(){
	this.completedList.forEach(todo=>{
		deleteEleFromArray(this.allList,todo);
	});
	this.completedList=[];
	this.show(this.todoList);
	this.save();
}

/**
 * 判断todo是否存在 存在返回当前索引的值,不存在返回-1
 */
function indexFromArr(arr,todo){
	if(arr instanceof Array){
		for(var i=0;i<arr.length;i++){
			if(arr[i].todo==todo.todo){
				return i;
			}
		}
		return -1;
	}
}

/**
 * 从数组中删除元素
 */
function deleteEleFromArray(arr,todo){
	var index=this.indexFromArr(arr,todo);
	if(index>-1){
		arr.splice(index,1);
		console.log("删除元素成功");
	}
}

function deleteTodo(todo){
	deleteEleFromArray(this.allList,todo);
	deleteEleFromArray(this.showList,todo);
	deleteEleFromArray(this.completedList,todo);
	deleteEleFromArray(this.todoList,todo);
	this.save();
	this.show(this.showList);
}

function updateValueFromArray(arr,value,todo){
	if(arr instanceof Array){
		for(var i=0; i<arr.length;i++){
			if(arr[i].todo==todo.todo){
				arr[i].isFinish=value;
			}
		}
	}
}

function selectCheckBox(todo){
	todo.isFinish=!todo.isFinish;
	var todoItems=document.getElementsByClassName("todoItem");
	for(var i=0;i<this.allList.length;i++){
		if(todo.isFinish){
			if(this.allList[i].todo==todo.todo){
				this.completedList.push(todo);
				deleteEleFromArray(this.todoList,todo);
				updateValueFromArray(this.allList,true,todo);
				this.show(this.completedList);
				break;
			}
		}else{
			if(this.allList[i].todo==todo.todo){
				this.todoList.push(todo);
				deleteEleFromArray(this.completedList,todo);
				updateValueFromArray(this.allList,false,todo);
				this.show(this.todoList);
				break;
			}
		}
	}
	this.save();
}

function save(){
	window.localStorage.setItem("allList",JSON.stringify(this.allList));
	window.localStorage.setItem("completedList",JSON.stringify(this.completedList));
	window.localStorage.setItem("todoList",JSON.stringify(this.todoList));
}

function updateSpan(arr){
	if(!(arr instanceof Array)){
		return;
	}
	document.getElementById("currentCountSpan").innerHTML="当前记录共"+arr.length+"条";
	document.getElementById("countSpan").innerHTML="总记录共"+this.allList.length+"条";
}

function test(ele){
// 	var edit_input=document.createElement("input");
// 	edit_input.setAttribute("style","display: none;");
// 	edit_input.setAttribute("id",todo.id+"input");
// 	edit_input.value=todo.todo;
// 	edit_input.setAttribute("onblur","blurTest("+todo+")");
// 	var input_id=todo.id+"input";
// 	var div_id=todo.id+"div";
// 	var edit_input=document.getElementById(input_id);
// 	var edit_div=document.getElementById(div_id);
// 	edit_input.focus();
// 	edit_input.style.display="inline";
// 	edit_div.style.display="none";
var spanEle=ele.getElementsByTagName("span")[0];
	var value=spanEle.innerHTML;
	var newInput=document.createElement("input");
	newInput.type="text";
	newInput.value=value;
	spanEle.innerHTML='';
	// 把新的 input 框 追加到当前元素节点中
	spanEle.appendChild(newInput);
	// 设置选择文本的内容或设置光标位置（两个参数：start,end；start为开始位置，end为结束位置；如果开始位置和结束位置相同则就是光标位置）
	newInput.setSelectionRange(0, value.length)
	// 为新 input 框获取焦点
	newInput.focus();
	// 为新的 input 添加失去焦点事件
	newInput.onblur = function () {
		// 判断失去焦点时，input 框的值是否与原值相同，相同则表示没有修改，返回原值；不同则表示有改动，返回新值
		spanEle.innerHTML = this.value == value? value : this.value;
		updateTodoFromArray(allList,value,this.value);
		updateTodoFromArray(showList,value,this.value);
		updateTodoFromArray(todoList,value,this.value);
		updateTodoFromArray(completedList,value,this.value);
		save();
	}
	
}


function updateTodoFromArray(arr,oldValue,newValue){
	if(arr instanceof Array){
		for(var i=0;i<arr.length;i++){
			if(arr[i].todo==oldValue){
				arr[i].todo=newValue;
			}
		}
	}
}

function blurTest(todo){
	var input_id=todo.id+"input";
	var div_id=todo.id+"div";
	var edit_input=document.getElementById(input_id);
	var edit_div=document.getElementById(div_id);
	var parentNode=edit_div.parentElement;
	edit_input.style.display="none";
	edit_div.style.display="inline";
	var edit_span=edit_div.getElementsByTagName("span")[0];
	edit_span.innerHTML=edit_input.value
}

window.onload=function(){
	var temp=window.localStorage.getItem("allList");
	if(temp!=undefined){
		this.allList=JSON.parse(temp);
	}
	temp=window.localStorage.getItem("completedList");
	if(temp!=undefined){
		this.completedList=JSON.parse(temp);
	}
	temp=window.localStorage.getItem("todoList");
	if(temp!=undefined){
		this.todoList=JSON.parse(temp);
	}
	this.show(this.allList);
	
	
}

