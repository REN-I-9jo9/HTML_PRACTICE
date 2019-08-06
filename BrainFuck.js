var Brainfuck=function(construct){
	let CommandFunc=function(p){
		this.parent=p;
	};
	CommandFunc.prototype["Default"]=function(){
		return "Default";
	};
	CommandFunc.prototype[" "]=function(){
		if(this.parent.commandptr<=1){
			this.parent.output="";
			this.looppair=[];
			this.parent.ptr=0;
			this.parent.data=[0];
			this.parent.commandptr=1;
			this.parent.isStart=true;
			this.isEnd=false;

			this.parent.CheckSyndax();
			return "Start";
		}
		else{
			this.parent.commandptr--;
			this.isEnd=true;
			return "END";
		}
	};
	CommandFunc.prototype[">"]=function(){
		this.parent.ptr++;
		if(!this.parent.data[this.parent.ptr])
			this.parent.data[this.parent.ptr]=0;
		return this.parent.ptr;
	};
	CommandFunc.prototype["<"]=function(){
		if(this.parent.ptr>0)
			this.parent.ptr--;
		return this.parent.ptr;
	};
	CommandFunc.prototype["+"]=function(){
		this.parent.data[this.parent.ptr]++;
		return this.parent.data[this.parent.ptr];
	};
	CommandFunc.prototype["-"]=function(){
		if(this.parent.data[this.parent.ptr]>0)
			this.parent.data[this.parent.ptr]--;
		return  this.parent.data[this.parent.ptr];
	};
	CommandFunc.prototype[","]=function(){
		let geti=this.parent.Input[0];
		if(geti){
			this.parent.data[this.parent.ptr]=parseInt(geti);
			this.parent.Input=this.parent.Input.substring(1, this.parent.Input.length);
		}
		return "Input "+geti;
	};
	CommandFunc.prototype["."]=function(){
		this.parent.output+=String.fromCharCode(this.parent.data[this.parent.ptr]);
		return "Output "+String.fromCharCode(this.parent.data[this.parent.ptr]);
	};
	CommandFunc.prototype["["]=function(){
		return "LoopStart";
	};
	CommandFunc.prototype["]"]=function(){
		if(this.parent.data[this.parent.ptr]>0){
			let loopno=this.parent.looppair[this.parent.commandptr];
			for(let cptr=0;cptr<this.parent.commandptr;cptr++){
				if(this.parent.looppair[cptr]==this.parent.looppair[this.parent.commandptr-1]){
					this.parent.commandptr=cptr;
					return "LoopContinue";
				}
			}
		}
		else{
			return "LoopEnd";
		}
	};
	this.CommandFunc=new CommandFunc(this);

	this.Command=" "+construct.command+" ";

	this.Input=construct.input;

	this.output="";

	this.looppair=[];


	this.ptr=0;
	this.data=[0];
	this.commandptr=0;
	this.isStart=false;
	this.isEnd=false;
};
Brainfuck.prototype.CheckSyndax=function(){
	let command=[];
	for(let i=0;i<this.Command.length;i++)
		command[i]=this.Command[i];
	let loopcount=0,newloop=false;
	do{
		let left=false;
		let lefti=0;
		newloop=false;
		for(let i=0;i<command.length;i++){
			if(command[i]=="["){
				left=true;
				lefti=i;
			}
			else if (command[i]=="]") {
				if(left){
					newloop=true;
					left=false;
					this.looppair[lefti]=loopcount;
					this.looppair[i]=loopcount;
					loopcount++;
					command[lefti]="*";
					command[i]="*";
				}
			}
		}
	}while(newloop);
	for(let i=0;i<command.length;i++){
		if(command[i]=="["||command[i]=="]"){
			for(let i=0;i<this.Command.length;i++)
				this.looppair[i]=null;
			return false;
		}
	}
	return true;
};
Brainfuck.prototype.run=function(){
	this.commandptr++;
	if(this.commandptr<=this.Command.length){
		return this.CommandFunc[this.Command[this.commandptr-1]]();
	}
	else
		return false;
};
Brainfuck.prototype.newCommand=function(newCommand){
	this.Command=" "+newCommand+" ";
	this.commandptr=0;
};
Brainfuck.prototype.newInput=function(newInput){
	this.Input=" "+newInput+" ";
	this.commandptr=0;
};