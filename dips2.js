
(function(window){

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
                        $(this).append($(ui.helper).clone());
                        $(this).append("<div class='tests'>"+ui.draggable.text()+"</div>");
                        
                        //Add new class
                        $(".rules .blocks").addClass("item-"+counts[0]);
                        $(".tests").addClass("test-"+counts[0]);
                        
                        //Remove the current class (ui-draggable)
                        $(".item-" + counts[0]).removeClass("blocks ui-draggable ui-draggable-dragging");
                     
                        // remove when double click
                        $(".test-"+counts[0]).dblclick(function() {
                            $(this).remove();
                            $(".item-"+counts[0]).remove();
                        });

                        /*$(".item-"+counts[0]).click(function() {
                            $(this).remove();
                        });*/

                        //tricky hidden ui.helper.clone
                        $(".item-" + counts[0]).css("color", "#B8E1DD");

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
            var states, effect, actions1, actions2, operator = '', otherwise = 0;
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
            var num_actions = 0;
            var num = 0;
            var actions = 'action';
            var action_count = 0;

            for( var i = 0; i < l.length; i++){
                //console.log(l[i].classList[0]);

                switch(l[i].classList[0]){
                    case "states":
                        states = l[i].innerHTML + '';
                        break;
                    case "actions":
                        if(action_count == 0){
                            action_count = 1;
                            actions1 = l[i].innerHTML + '';
                        }
                        else {
                            actions2 = l[i].innerHTML + '';
                            action_count = 0;
                        }
                        //num = ++num_actions;
                        //for(var n=1; n<=num; n++){
                        //    if(action_count == 0) {
                        //        action_count = 1;
                        //        var a = actions+[n];
                        //        a = l[i].innerHTML + '';
                        //    }
                        //    else {
                        //        var b = actions+[++n];
                        //        b = l[i].innerHTML + '';
                        //    }
                        //}

                        break;
                    case "effects":
                        effect = l[i].innerHTML + '';
                        break;
                    case "operators":
                        operator = l[i].innerHTML + '';
                        //if(operator_count == 0) {
                        //    operator_count = 1;
                        //    var operator1 = l[i].innerHTML + '';
                        //}
                        //else {
                        //    var operator2 = l[i].innerHTML + '';
                        //    operator_count = 0;
                        //}
                        break;
                    case "otherwise":
                        otherwise = 1;
                        break;
                    default:
                        break;
                }
            }

            var operator_count = 0;

            //imports +
            rule = ruleName + 'when(' + states + /* more states generator */
                ')' + actions1 + (otherwise ? ' otherwise ' + actions2 : ' ') +'\n';

            //rule = ruleName + 'when(' + states +
            //    ')' + a + (otherwise ? 'otherwise' + b + ' ' : ' ') +
            //    '\nlistener.instruct(Rule' + count + ')\n' + num;

            return rule;
        },
        add_rule: function(){
            var r = $('.newr'); // only one newr
            var l = r.children();
            var count = parseInt(r[0].id.split('-')[1]);
            var accumulator = count + 1;
            var rule = '';

            try{
                //var show = _this.make_droppable();
                $('.editor').append('<div class="rules newr" id="rule-'+ accumulator + '"><br></div>');

                _this.make_droppable();
                r.removeClass('newr');
                r.css({"background-color":"#044A42","color":"#EEEEEE","font-weight":"bold","font-style":"italic"});
                // r.css("background-color", "#00ADB5").css("color", "#EEEEEE");
                ruleList.push(r[0].id);

                --accumulator;
                $('.preview').append('<div class="newre" id="result-' + accumulator + '"><br><br><hr /></div>');
                rule = _this.make_rule(l, count);
                $('#result-' + accumulator).html('<p><input type="checkbox" class="delete"' 
                    + 'id="delete-' + accumulator + '"'
                    //+ 'onChange=$(this).parent().remove();'
                    + '/><label for="delete-'+accumulator+'"><span class="ui"></span>'
                    //+ '<span id="test-' + accumulator + '">'
                    + rule.replace(/\n/g, '<br>')
                    + '</label></p>'
                );

            }catch(e){
                alert(e);
            }
        },// end of add_rulep
        d_check: function() {
            var sel = false;
            var c = confirm('delete or not?');
            if(c) {
                for (var r in ruleList) {
                    var count = ruleList[r].split('-')[1];
                    if ($("#delete-" + count).prop('checked')) {
                        sel = true;
                        $("#rule-" + count).remove();
                        $("#delete-" + count).remove();
                        $("#test-" + count).remove();
                        $("#result-" + count).remove();
                        ruleList.splice($.inArray("rule-" + count, ruleList), 1)
                    }
                    //$("#delete-"+count+":checked").remove();
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
        for(var r in ruleList){
            console.log(ruleList[r]);
            /* final check if rule is changed */
            var l = $('#' + ruleList[r]).children();
            var count = ruleList[r].split('-')[1];
            var rule = '';
            rule = dips().make_rule(l, count);
            // console.log(rule);
            console.log($.get('http://localhost:12345', {rule: rule}));
        }
    });

    var drpOptions = {
        drop: function(event, ui) {
            $(this).append("<div class='tests'>"+ui.draggable.text() + "</div>" );
        }
    };
    //
    //$( ".rules" ).children().droppable( drpOptions );
    dips().make_droppable();

})(window);
