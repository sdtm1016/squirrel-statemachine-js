/*global require, module, it, describe*/
/*jslint node: true */
'use strict';
var should = require('chai').should(),
		expect = require('chai').expect,
    squirrel = require('../index'),
    StateMachine = squirrel.StateMachine;

describe('#StateMachine basic function', function() {
	var SimpleStateMachine = StateMachine.extend({
		// state machine definition
		definition : {
	  	initial : "A",
	  	states : {
	  		A : { onEntry: "enterA", onExit: "exitA" },
	  		B : { onEntry: "enterB", onExit: "exitB" }
	  	},

	  	transitions : [
	  		{ from : "A", to : "B", on : "A2B", perform : "fromAToB" },
	  		{ from : "B", to : "A", on : "B2A", perform : function() {this.callSequence += ".fromBToA";} }
	  	]
	  },

	  // state machine initialize function
	  initialize : function() {
	 		this.callSequence = "";
	 	},

	 	// state machine actions
	  enterA : function() {
	 		this.callSequence += ".enterA";
	  },

	  exitA : function() {
	 		this.callSequence += ".exitA";
	  },

	  fromAToB : function() {
	  	this.callSequence += ".fromAToB";
	  },

	  enterB : function() {
	 		this.callSequence += ".enterB";
	 	},

  	exitB : function() {
  		this.callSequence += ".exitB";
  	}
	});

	it("A simple state machine should enter its initial states and status should be idle when started", 
		function() {
			var stateMachineInstance = new SimpleStateMachine("A");
			stateMachineInstance.start();
			stateMachineInstance.callSequence.should.equal(".enterA");
			stateMachineInstance.getCurrentState().should.equal("A");
			stateMachineInstance.getStatus().should.equal(squirrel.StateMachineStatus.IDLE);
	});

	it("A simple state machine should throw error when it is not started and its options 'isAutoStartEnabled' is false", 
		function() {
			var fireUnstartedFsmFunc = function() {
				var stateMachineInstance = new SimpleStateMachine("A", {isAutoStartEnabled : false});
				stateMachineInstance.fire("A2B");
			};
			expect(fireUnstartedFsmFunc).to.throw(/not running/); 
	});

  it("A simple external transition should include old state exit, transition perform and new state entry", 
  	function() {
	  	var stateMachineInstance = new SimpleStateMachine(), 
	  	stateMachineInstance2 = new SimpleStateMachine("B");

	  	stateMachineInstance.fire("A2B");
	  	stateMachineInstance.callSequence.should.equal(".enterA.exitA.fromAToB.enterB");

	  	stateMachineInstance2.fire("B2A");	  	
	    stateMachineInstance2.callSequence.should.equal(".enterB.exitB.fromBToA.enterA");
  });
});