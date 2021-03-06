# squirrel-statemachine.js  
squirrel-statemachine.js is a javascript implementation of [squirrel-foundation](https://github.com/hekailiang/squirrel) which is a java state machine library. 

### Sample Code: 

```javascript  
var SimpleStateMachine = Squirrel.StateMachine.extend({
    // state machine definition
    machine : {
      states : {
        A : { onEntry: "enterA", onExit: "exitA", initial:true },
        B : { onEntry: "enterB", onExit: "exitB" },
        F : { onEntry: function() { this.callSequence += ".enterF"; },
          onExit:  function() { this.callSequence += ".exitF"; },
          final: true }
      },

      transitions : [
        { from : "A", to : "B", on : "A2B", perform : "fromAToB" },
        { from : "B", to : "A", on : "B2A", perform : function fromBToA() { this.callSequence += ".fromBToA"; } },
        { from : "B", to : "C", on : "B2C", perform : function fromCToD() { this.fire("C2D"); this.fire("D2E"); } },
        { from : "C", to : "D", on : "C2D" },
        { from : "D", to : "E", on : "D2E" },
        { from : "D", to : "F", on : "D2F", when : function moreThanTen(context) {return context>10;} },
        { from : "A", to : "F", on : "END" }
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

    methodMissing : function(methodName) {
      this.callSequence += "."+methodName;
    }
  });

  var SimpleStateMachineEx = SimpleStateMachine.extend({
    machine : {
      initial : "B",
        states : {
          A : { onEntry: "enterAFromEx:0" }, // invoked after original entry method
          B : { onExit: "exitBFromEx:0"}     // invoked after original entry method
        }
    },

    enterAFromEx : function() {
      this.callSequence += ".enterAFromEx";
    },

    exitBFromEx : function() {
      this.callSequence += ".exitBFromEx";
    }
  });

  var simpleStateMachineExInstance = new SimpleStateMachineEx(null /*use default*/, {isDebugInfoEnabled: true});
  simpleStateMachineExInstance.start();
  console.log("Current State: "+simpleStateMachineExInstance.getCurrentState());
  simpleStateMachineExInstance.fire("B2A");
  console.log("Call sequences: "+simpleStateMachineExInstance.callSequence);
```