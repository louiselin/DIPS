
(function(window){

document.onselectstart=function(){event.returnValue=false}
    var dips = function(){
        return new dips.prototype.init();
    };// end of var dips

    var _this = '';
    var ruleList = [];
    var counts = [0];

    var zIndex = 0;

    dips.prototype = {
        init: function(){
            _this = this;
            //return _this;  // neccessary?
        },
        make_droppable: function(){
            $(".rules").droppable({
                over: function(){
                    console.log(this);
                    //TODO: $(this).background color go bright

                },
                drop: function(e, ui){
                    $(this).addClass("ui-state-highlight");
                    if(ui.draggable.hasClass("blocks")) {
                        // if(ui.hasClass("menu")) {
                            console.log(ui.draggable.text());
                        // }
                        var blockstext = ui.draggable.text();
                        var menutext = '';
                        if(blockstext){
                            if(blockstext == 'RightHandUp' || blockstext == 'RightHandDown' || blockstext == 'LeftHandUp' || blockstext == 'LeftHandDown') menutext = 'TRIGGERS';
                            else if(blockstext == 'and' || blockstext == 'or' || blockstext == 'not') menutext = 'OPERATORS';
                            else if(blockstext == 'otherwise') menutext = 'OTHERWISE';
                            else menutext = 'ACTIONS';
                        } 
                        
                        $(this).append($(ui.helper).clone());
                        $(this).append("<div class='tests'><span class='dragedit'>"+ menutext +"</span>"+ui.draggable.text()+"</div>");
                        
                        //Add new class
                        $(".rules .blocks").addClass("item-"+counts[0]);
                        $(".tests").addClass("test-"+counts[0]);
                        
                        //Remove the current class (ui-draggable)
                        $(".item-" + counts[0]).removeClass("blocks ui-draggable ui-draggable-dragging");
                     
                        // remove when double click
                        $(".test-"+counts[0]).click(function() {
                            // console.log(".test-"+counts[0] + "============" + ".item-"+counts[0]);
                            $(this).remove();
                            $(".item-"+counts[0]).remove();
                            
                        });

                        //tricky hidden ui.helper.clone
                        $(".item-" + counts[0]).css("color", "rgba(255,255,255,0);");

                        // make draggable after dropping into droppable area
                        _this.make_draggable($(".item-"+counts[0]));
                    }
                }// end of drop
            });
        },
        make_draggable: function(elements){
            elements.draggable({
                containment:'parent',
                start:function(e,ui){
                    ui.helper.css('z-index',++zIndex);
                },
                stop:function(e,ui){}
            });
        }, // end of make_draggable
        make_rule: function(l, count){
            var rule = '';
            var states, effect, actions1, actions2, actions3, operator = '', otherwise = 0;
            var imports = 'import com.zgrannan.ubicomp._\n' +
                'import Implicit._\n' +
                'import Syntax._\n' +
                'import edu.nccu.plsm.ubicomp.demo._\n' +
                'import DemoDevice._\n' +
                'import DemoAction._\n' +
                'import DemoEffect._\n' +
                'import DemoState._\n\n';

            var ruleName = 'Rule' + count + ' = ';
            // var ruleName = 'val Rule' + count + ' = ';

            var action_count = 0;
            var operators = 0;
            var num, num_actions = 0;
            var statexchangetext = '';
            var actionchangetext = '';

            for(var i = 0; i < l.length; i++){
                console.log(l[i].classList[0]);

                switch(l[i].classList[0]){
                    case "states":
                        switch(l[i].innerHTML){
                            case 'RightHandUp': statexchangetext = 'rightHandUp';break;
                            case 'RightHandDown': statexchangetext = 'rightHandDown';break;
                            case 'LeftHandUp': statexchangetext = 'leftHandUp';break;
                            case 'LeftHandDown': statexchangetext = 'leftHandDown';break;    
                            default: statexchangetext = 'leftHandUp';break;
                        }
                        // states = l[i].innerHTML + '';
                        states = statexchangetext;
                        break;  
                    case "actions":
                        num = ++num_actions;

                        if(action_count == 0){
                            action_count = 1;
                            actions1 = l[i].innerHTML + '';
                        }
                        else if(action_count == 1){
                            action_count = 2;
                            actions2 = l[i].innerHTML + '';
                        }
                        else {
                            actions3 = l[i].innerHTML + '';
                            action_count = 0;
                        }

                        break;
                    case "operators":
                        operators = 1;
                        operator = l[i].innerHTML + '';
                        
                       
                        break;
                    case "otherwise":
                        otherwise = 1;
                        break;
                    default:
                        break;
                }
            }

            if(operators==0) {
                rule = ruleName + 'when(' + states + /* more states generator */
                '){ ' + actions1 + ' }'+ (otherwise ? ' otherwise {' + actions2 + ' }': '') + '\n';    
            } else if(operators==1) {
                if(num==2) {
                    rule = ruleName + 'when(' + states + /* more states generator */
                '){ ' + actions1 + operator + actions2 + ' }' + '\n';    
                } else if(num==3) {
                    rule = ruleName + 'when(' + states + /* more states generator */
                '){ ' + actions1 + (otherwise ? ' otherwise ' + actions2 + ' ': ' ') 
                    + operator + actions3 + ' }\n';    
                } else {
                    // rule = "no defined!";
                    alert("Error!");
                }      
            } else {
                alert("Out of defined!");
            }
           
            return rule;
        },
        make_run: function(l, count){
            var ruleRun = '';
            var states, effect, actions1, actions2, actions3, operator = '', otherwise = 0;
            var action_count = 0;
            var operators = 0;
            var num, num_actions = 0;

            var statexchangetext = '';
            var actionchangetext = '';

            for(var i = 0; i < l.length; i++){
                switch(l[i].classList[0]){
                    case "states":
                        switch(l[i].innerHTML){
                            case 'RightHandUp': statexchangetext = 'rightHandUp';break;
                            case 'RightHandDown': statexchangetext = 'rightHandDown';break;
                            case 'LeftHandUp': statexchangetext = 'leftHandUp';break;
                            case 'LeftHandDown': statexchangetext = 'leftHandDown';break;    
                            default: statexchangetext = 'leftHandUp';break;
                        }
                        // states = l[i].innerHTML + '';
                        states = statexchangetext;
                        break;    
                    case "actions":

                        if(action_count == 0){
                            action_count = 1;
                            actions1 = l[i].innerHTML + '';
                        }
                        else if(action_count == 1){
                            action_count = 2;
                            actions2 = l[i].innerHTML + '';
                        }
                        else {
                            actions3 = l[i].innerHTML + '';
                            action_count = 0;
                        }
                        break;
                    case "operators":
                        operators = 1;
                        operator = l[i].innerHTML + '';
                        break;
                    case "otherwise":
                        otherwise = 1;
                        break;
                    default:
                        break;
                }
            }

            if(operators==0) {
                ruleRun = 'when(' + states + 
                '){' + actions1 + '}'+ (otherwise ? ' otherwise {' + actions2 + '}': '');    
            } else if(operators==1) {
                if(num==2) {
                    ruleRun = 'when(' + states + 
                '){' + actions1 + operator + actions2 + '}';    
                } else if(num==3) {
                    ruleRun = 'when(' + states + 
                '){' + actions1 + (otherwise ? ' otherwise ' + actions2 + ' ': ' ') 
                    + operator + actions3 + '}';    
                } else {
                    alert("Error!");
                }      
            } else {
                alert("Out of defined!");
            }
            return ruleRun;
        },
        add_rule: function(){
            var r = $('.newr'); // only one newr
			var re = $('.newre');
            var l = r.children();
            var count = parseInt(r[0].id.split('-')[1]);
            var accumulator = count + 1;
            var rule = '';

            try{
                //var show = _this.make_droppable();
                $('<div class="rules newr" id="rule-'+ accumulator + '"><br></div>').insertBefore(r[0]);

                _this.make_droppable();
                r.removeClass('newr');
                r.css({"background-color":"#89A570","color":"#FFFFFF","font-weight":"bold","font-style":"italic"});
                ruleList.push(r[0].id);

                --accumulator;
				if(accumulator==1){
                	$('.preview').append('<div class="newre" id="result-' + accumulator + '"><br><br><hr /></div>');
                }
				else{
				  	$('<div class="newre" id="result-' + accumulator + '"><br><br><hr /></div>').insertBefore(re[0]);
				}
				rule = _this.make_rule(l, count);
                $('#result-' + accumulator).html('<p>'
                    + '<label for="delete-'+accumulator+'"><span class="ui"></span>'
                    + rule.replace(/\n/g, '<br>')
                    + '</label></p>'
                );

            }catch(e){
                alert(e);
            }
        },// end of add_rulep
        d_check: function() {
            var sel = false;
            
            var c = confirm('Sure?');
            if(c) {
                
                var ch = $('.preview').find('input[type=checkbox]');
                    for(var i=1;i<=ch.length;i++){
                        sel = true;
                        if($("#delete-" + i).is(':checked')){
                            console.log("check!!!"+i);
                            $("#rule-" + i).remove();
                            $("#delete-" + i).remove();
                            $("#test-" + i).remove();
                            $("#result-" + i).remove();
                            ruleList.splice($.inArray("rule-" + i, ruleList), 1);
                        }
                    }
                
                
                if(!sel) alert('No data selected!');
            }
            return false;
            //$(this).parent().remove();
        }
    }// end of dips prototype

    dips.prototype.init.prototype = dips.prototype;
    window.dips = dips;

    //Make every clone image unique.

    var resizeOpts = {
        handles: "all" ,autoHide:true
    };

    $(".blocks").draggable({
        revert: "invalid", //drag to target position
        helper: "clone",
        //stack: ".blocks",
        start: function() {
            $("").droppable( drpOptions ).appendTo( ".rules" );
            counts[0]++;
        }  //Create counter
    });


    // finished a rule and add new rule input
    $('#new').click(dips().add_rule);


    $("#deleteAll").click(dips().d_check);

    
    // finised all rules and submit to engine
    $('#finish').click(function(){
        var rule = '';
        var ruletotal = [];
        var res = '';
        

        for(var r in ruleList){
            var l = $('#'+ruleList[r]).children();
            var count = ruleList[r].split('-')[1];
            rule = dips().make_run(l, count);
            
            
                if(count!=1 && count==ruleList.length-1) rule = rule + ",";
                else rule = rule;
                //console.log("rule: "+rule);
                
            
            ruletotal.push(rule);
            // for(var i = 0; i<ruleList.length; i++){
            //     if(i==ruleList.length) { // the last one no comma
            //         rule = dips().make_run(l, count)+",";
            //     }
            //     // else {
            //     //     rule += dips().make_run(l, count);
            //     //     rule += ',';
            //     // }
            // }
        }
            // console.log(ruletotal.toString());
            console.log($.get('http://192.168.0.105:12345', {rule:ruletotal.toString()}));
            //console.log($.get('http://localhost:12345?', {rule:ruletotal}));
            //console.log($.get('http://192.168.0.100:12345', {rule: rule}));
    });
    

    var drpOptions = {
        drop: function(event, ui) {
            $(this).append("<div class='tests'><span class='dragedit'>"+ menutext +"</span>"+ui.draggable.text()+"</div>");
        }
    };
    //
    //$( ".rules" ).children().droppable( drpOptions );
    dips().make_droppable();

})(window);
