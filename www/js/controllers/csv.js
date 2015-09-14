angular.module('starter.csv',[])
.service("CSVservice",function(){

  return{
    calcNaming:function(data){
      var body='';
      var header='';
      var arr=data.naming_arr;
      var count=0,all=0;
      console.log(data);
      header+='Naming Test,,,,,,\n';
      header+='Date:,'+data.dateTest+',,,,,\n';
      header+='Examiner:,'+data.doctor+',,,,,\n';
      header+='Patient ID:,'+data.name+',,,,,\n';
      header+='Patient DOB:,'+data.dob+',,,,,\n';
      header+=', ,,,,,\n';
      header+='Item,,Duration,Score,,,\n';
      for(var i=0;i<arr.length;i++){
        count+=arr[i].res!='-1'?arr[i].res:0;
        body+=i+1+'.,'+
        arr[i].name+','+
        arr[i].duration+'sec,'+
        (arr[i].res!='-1'?arr[i].res:0);
        if(i==9||i==19||i==29)
        {all+=count;
          body+=',Subtotal=,'+count+',/10\n';
          if(i==29){body+=',,,,'+'GRAND TOTAL=,'+all+',/30\r\n';}
          count=0;
        }
        else{
          body+=',,,\n';
        }
      }
      header+=body;
      return header;
    },
    calcRepetition:function(data){
      var body='';
      var header='';
      var arr=data.repetition_arr;
      var count=0,all=0;
      console.log(data);
      header+='Repetition Test,,,,,,\n';
      header+='Date:,'+data.dateTest+',,,,,\n';
      header+='Examiner:,'+data.doctor+',,,,,\n';
      header+='Patient ID:,'+data.name+',,,,,\n';
      header+='Patient DOB:,'+data.dob+',,,,,\n';
      header+=', ,,,,,\n';
      header+='Item,,Duration,Score,,,\n';
      for(var i=0;i<arr.length;i++){
        count+=arr[i].res!='-1'?arr[i].res:0;
        body+=i+1+'.,'+
        arr[i].name+','+
        arr[i].duration+'sec,'+
        (arr[i].res!='-1'?arr[i].res:0);
        if(i==9||i==19||i==29)
        {all+=count;
          body+=',Subtotal=,'+count+',/10\n';
          if(i==29){body+=',,,,'+'GRAND TOTAL=,'+all+',/30\r\n';}
          count=0;
        }
        else{
          body+=',,,\n';
        }
      }
      header+=body;
      return header;
    },
    calcWord:function(data){
      var body='';
      var header='';
      var arr=data.word_arr;
      var count=0,all=0;
      console.log(data);
      header+='Word Test,,,,,,,\n';
      header+='Date:,'+data.dateTest+',,,,,,\n';
      header+='Examiner:,'+data.doctor+',,,,,,\n';
      header+='Patient ID:,'+data.name+',,,,,,\n';
      header+='Patient DOB:,'+data.dob+',,,,,,\n';
      header+=', ,,,,,,\n';
      header+='Item,,Response,Duration,Score,,,\n';
      for(var i=0;i<arr.length;i++){
        count+=arr[i].res!='-1'?arr[i].res:0;
        body+=i+1+'.,'+
        arr[i].name+','+(arr[i].clicked||'')+','+
        arr[i].duration+'sec,'+
        (arr[i].res!='-1'?arr[i].res:0);
        if(i==9||i==19||i==29)
        {all+=count;
          body+=',Subtotal=,'+count+',/10\n';
          if(i==29){body+=',,,,,'+'GRAND TOTAL=,'+all+',/30\r\n';}
          count=0;
        }
        else{
          body+=',,,\n';
        }
      }
      header+=body;
      return header;
    },
    calcSemantic:function(data){
      var body='';
      var header='';
      var arr=data.semantic_arr;
      var count=0,all=0;
      console.log(data);
      header+='SEMANTIC ASSOCIATION,,,,,,,,\n';
      header+='Date:,'+data.dateTest+',,,,,,,\n';
      header+='Examiner:,'+data.doctor+',,,,,,,\n';
      header+='Patient ID:,'+data.name+',,,,,,,\n';
      header+='Patient DOB:,'+data.dob+',,,,,,,\n';
      header+=', ,,,,,,,\n';
      header+='Item,,,Response,Duration,Score,,,\n';
      for(var i=0;i<arr.length;i++){
        count+=arr[i].res!='-1'?arr[i].res:0;
        body+=i+1+'.,'+
        arr[i].name+','+(arr[i].correct||'')+','+arr[i].clicked+','+
        arr[i].duration+'sec,'+
        (arr[i].res!='-1'?arr[i].res:0);
        if(i==9||i==19||i==29)
        {all+=count;
          body+=',Subtotal=,'+count+',/10\n';
          if(i==29){body+=',,,,,,'+'GRAND TOTAL=,'+all+',/30\r\n';}
          count=0;
        }
        else{
          body+=',,,\n';
        }
      }
      header+=body;
      return header;
    }

  }
});
