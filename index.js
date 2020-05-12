let isFocus = false;
let univ_data = {};
let color_class_all = {};
let color_class_partial = {};
let total_data;
// let sheetNames;
let chart2 = null;
let chart2_partial = null;
let color_arr_all = ['#CF5948', '#F5A623', '#A5CF29', '#8C89FF', '#688197', '#33CAEF'];
let color_arr_partial = ['#CF5948', '#00B9F1', '#58C9B9'];
let result;
function getCookie(name) {
    let cookie = document.cookie;
    if (document.cookie != "") {
        let cookie_array = cookie.split("; ");
        for (let index in cookie_array) {
            let cookie_name = cookie_array[index].split("=");
            if (cookie_name[0] == "openSurvey") {
                return cookie_name[1];
            }
        }
    }
    return;
}
function openNotice() {
    let cookieCheck = getCookie("openSurvey");
    if (cookieCheck != "N") $('#div_notice_blur').css('display','flex');
}
function setCookie(name, value, expiredays) {
    let date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString();
}

function closeNotice() {
    result += '&'+$("#opinion_form").serialize();
    window.open('http://13.209.221.206/openuniv/survey.html?'+result);
    setCookie("openSurvey", "N", 365);
    $('#div_notice_blur').hide();
}

function copyToClipboard() {
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val('team2gloo@gmail.com').select();
    document.execCommand("copy");
    $temp.remove();
    alert("복사되었습니다.")
}

function list_click(_univ) {
    $('#main_search_input').val(_univ);
    search();
}
function goPage(current, pageId) {
    $(current).fadeOut(200); $(pageId).delay(200).fadeIn(200);
    $('html, body').animate({ scrollTop: 0 }, 0);
}
function search() {
    isFocus = false;
    let univ = $('#main_search_input').val();
    if (univ === '') alert('학교를 입력해주세요');
    else {
        let univ_list = univ_data['학교리스트'];
        if (univ == "카이스트" || univ == "KAIST") univ = "카이스트(KAIST)";
        if (univ == "유니스트" || univ == "UNIST") univ = "유니스트(UNIST)";
        if (univ.indexOf("ERICA") !== -1 || univ.indexOf("에리카") !== -1) univ = "한양대학교ERICA";
        let idx = univ_list.findIndex(obj => obj.label === univ);
        let tmp_idx = univ_list.findIndex(obj => obj.label === univ + "학교");
        if (idx === -1 && tmp_idx === -1) {
            alert('등록되지 않은 학교입니다');
        }
        else {
            if (idx === -1) {
                idx = tmp_idx;
                univ += "학교";
            }
            let selected = univ_list[idx];
            let district_data = univ_data[selected.district];
            let main_univ_idx = district_data.findIndex(obj => obj['대학명'] === univ);
            let main_univ = district_data[main_univ_idx];
            univ_name = main_univ["대학명"];
            $("#univ_header_title_mobile").html(univ_name);
            $('#univ_after').hide();
            $('#univ_url').val('');
            if (univ_name.indexOf("대학교") !== -1) {
                univ_name = univ_name.replace("대학교", "");
                $('#univ_after').show();
            }
            $("#univ_main_1_1_univ").html(univ_name);
            $("#univ_main_1_1_date").html(main_univ['개강일']);
            if (main_univ['제한적 대면'] === 'O') $("#univ_main_1_1_date").append('<div class="univ_main_f_f">(제한적 대면)</div>')
            $("#univ_url").val(jQuery.trim(main_univ['홈페이지']));
            let district_total = total_data[total_data.findIndex(obj => obj[0] === selected.district)];



            let ctx2 = $("#univ_main_2_1_graph").get(0).getContext("2d");
            let column_all = Object.values(total_data[0]).slice(3,8);
            let column_data_all = Object.values(district_total).slice(3,8);
            let ctx2_partial = $("#univ_main_2_1_graph_partial").get(0).getContext("2d");
            let column_partial = Object.values(total_data[0]).slice(8);
            let column_data_partial = Object.values(district_total).slice(8);
            let config = {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: column_data_all,
                        backgroundColor: color_arr_all.slice(0, column_all.length),
                        borderWidth: 0
                    }],
                    labels: column_all,
                },
                options: {
                    tooltips: {
                        bodyFontSize: 15,
                        bodyFontFamily: "yg-jalnan",
                        callbacks: {
                            label: function (tooltipItem, data) {
                                let per = (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] / district_total[2]) * 100;
                                return data.labels[tooltipItem.index] + " : " + per.toFixed(1) + " %";;
                            }
                        }
                    },
                    legend: {
                        display: false
                    },
                    responsive: true,
                    cutoutPercentage: 80,
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    },
                }
            };
            let config2 = {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: column_data_partial,
                        backgroundColor: color_arr_partial.slice(0, column_partial.length),
                        borderWidth: 0
                    }],
                    labels: column_partial,
                },
                options: {
                    tooltips: {
                        bodyFontSize: 15,
                        bodyFontFamily: "yg-jalnan",
                        callbacks: {
                            label: function (tooltipItem, data) {
                                let per = (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] / district_total[2]) * 100;
                                return data.labels[tooltipItem.index] + " : " + per.toFixed(1) + " %";;
                            }
                        }
                    },
                    legend: {
                        display: false
                    },
                    responsive: true,
                    cutoutPercentage: 80,
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    },
                }
            };
            if (chart2 != null) chart2.destroy();
            chart2 = new Chart(ctx2, config);
            if (chart2_partial != null) chart2_partial.destroy();
            chart2_partial = new Chart(ctx2_partial, config2);
            $('#univ_main_2_1_1_district').html(district_total[0]);
            $('#univ_main_3_district').html(district_total[0]);
            $('#univ_main_2_1_1_count').html(district_total[2]);
            $('#univ_main_2_1_1_date').html(district_total[1]);


            let date_input = '';
            let count_input = '';
            let date_input_partial = '';
            let count_input_partial = '';
            for (let i = 0; i < column_all.length; i++) {
                date_input += '<span class="' + color_class_all[column_all[i]] + '">' + column_all[i] + '</span>';
                count_input += '<span>' + column_data_all[i] + ' 곳</span>';
            }
            for (let i = 0; i < column_partial.length; i++) {
                date_input_partial += '<span class="' + color_class_partial[column_partial[i]] + '">' + column_partial[i] + '</span>';
                count_input_partial += '<span>' + column_data_partial[i] + ' 곳</span>';
            }

            $('#univ_main_2_2_date_all').html(date_input);
            $('#univ_main_2_2_count_all').html(count_input);
            $('#univ_main_2_2_date_partial').html(date_input_partial);
            $('#univ_main_2_2_count_partial').html(count_input_partial);


            let list_univ_input = '';
            let list_date_input = '';
            for (let i = 0; i < district_data.length; i++) {
                let univ_date = district_data[i];
                list_univ_input += '<span>' + univ_date['대학명'];
                if (univ_date['업데이트'] === 'N') list_univ_input += '<div class="univ_update_mark"></div>';
                list_univ_input += '</span>';
                list_date_input += '<span class="' + color_class_all[univ_date['group']] + '">' + univ_date['개강일'];
                if (univ_date['제한적 대면'] === 'O') list_date_input += '<div class="univ_f_f">(제한적 대면)</div>';
                list_date_input += '</span>';

            }
            $('#univ_main_3_1_univ').html(list_univ_input);
            $('#univ_main_3_1_date').html(list_date_input);
            location.href = "#univ";
        }

    }
}
// function order_list_by_group(group) {
//     let ordered_list = new Array;
//     for (let i = 2; i < sheetNames.length; i++) {
//         univ_data[sheetNames[i]].map((univ) => {
//             if (univ.group === group) ordered_list.push(univ);
//         });
//     }
//     console.log(ordered_list);
// }
$(document).ready(function () {
    openNotice();
    $(window).resize(function () {
        $(".ui-autocomplete").hide();
    });
    fetch('./data.xlsx?version=0512').then((res) => {
        res.arrayBuffer().then((ab) => {
            let data = XLSX.read(ab, { type: "array" });
            sheetNames = data.SheetNames;
            for (let i = 0; i < data.SheetNames.length; i++) {
                univ_data[data.SheetNames[i]] = XLSX.utils.sheet_to_json(data.Sheets[data.SheetNames[i]]);
            }
            $("#main_search_input").autocomplete({
                minLength: 1,
                source: univ_data['학교리스트'],
                delay: 0,
                autoFocus: true,
                focus: function (event, ui) {
                    isFocus = true;
                    return false;
                },
                select: function (event, ui) {
                    event.preventDefault();
                    $("#main_search_input").val(ui.item.label);
                    search();
                    return false;
                },
            }).autocomplete("instance")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<div class='search_autoComplete'>" + item.label + "</div>")
                    .appendTo(ul);
            };
            total_data = univ_data['통계'];
            let ctx_all = $("#main_graph_canvas_all").get(0).getContext("2d");
            let ctx_partial = $("#main_graph_canvas_partial").get(0).getContext("2d");
            let column_all = Object.values(total_data[0]).slice(3,8);
            let column_data_all = Object.values(total_data[1]).slice(3,8);
            let column_partial = Object.values(total_data[0]).slice(8);
            let column_data_partial = Object.values(total_data[1]).slice(8);
            let config = {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: column_data_all,
                        backgroundColor: color_arr_all.slice(0, column_all.length),
                        borderWidth: 0
                    }],
                    labels: column_all,
                },
                options: {

                    tooltips: {
                        bodyFontSize: 15,
                        bodyFontFamily: "yg-jalnan",
                        callbacks: {
                            label: function (tooltipItem, data) {
                                let per = (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] / total_data[1][2]) * 100;
                                return data.labels[tooltipItem.index] + " : " + per.toFixed(1) + " %";
                            }
                        }
                    },
                    legend: {
                        display: false
                    },
                    responsive: true,
                    cutoutPercentage: 80,
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    },
                }
            };
            let config_partial = {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: column_data_partial,
                        backgroundColor: color_arr_partial.slice(0, column_partial.length),
                        borderWidth: 0
                    }],
                    labels: column_partial,
                },
                options: {

                    tooltips: {
                        bodyFontSize: 15,
                        bodyFontFamily: "yg-jalnan",
                        callbacks: {
                            label: function (tooltipItem, data) {
                                let per = (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] / total_data[1][2]) * 100;
                                return data.labels[tooltipItem.index] + " : " + per.toFixed(1) + " %";
                            }
                        }
                    },
                    legend: {
                        display: false
                    },
                    responsive: true,
                    cutoutPercentage: 80,
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    },
                }
            };
            $('#main').fadeIn(1000);
            let style = "<style type='text/css'>";
            let chart = new Chart(ctx_all, config);
            let chart_partial = new Chart(ctx_partial,config_partial);

            $('#main_univ_count').html(total_data[1][2]);
            $('#main_update_date').html(total_data[1][1]);


            style += "._0 {color:" + color_arr_all[0] + "; !important} ";            
            color_class_all[column_all[0]] = '_0';
            let input = '<div class="main_total_table_column"><div class="main_total_table_column_date _0">';
            input += '<span>' + column_all[0] + '</span></div><div class="main_total_table_column_count"><span>' + column_data_all[0] + ' 곳</span></div></div>';
            for (let i = 1; i < column_all.length; i++) {
                let className = "_" + i;
                color_class_all[column_all[i]] = className;
                style += "." + className + "{color:" + color_arr_all[i] + "; !important}";
                input += '<svg class="vertical_line" viewBox="0 0 1 60"><path fill="transparent" stroke="#E1E1E1" stroke-width="30px" stroke-linejoin="miter"stroke-linecap="butt" stroke-miterlimit="4" shape-rendering="auto" d="M 0 0 L 0 60"></path></svg>';
                input += '<div class="main_total_table_column"><div class="main_total_table_column_date ' + className + '">';
                input += '<span>' + column_all[i] + '</span></div><div class="main_total_table_column_count"><span>' + column_data_all[i] + ' 곳</span></div></div>';
            }

            style += "._0_partial {color:" + color_arr_partial[0] + "; !important} ";
            color_class_partial[column_partial[0]] = '_0_partial';
            let input_partial = '<div class="main_total_table_column"><div class="main_total_table_column_date _0_partial">';
            input_partial += '<span>' + column_partial[0] + '</span></div><div class="main_total_table_column_count"><span>' + column_data_partial[0] + ' 곳</span></div></div>';
            for (let i = 1; i < column_partial.length; i++) {
                let className = "_" + i+"_partial";
                color_class_partial[column_partial[i]] = className;
                style += "." + className + "{color:" + color_arr_partial[i] + "; !important}";
                input_partial += '<svg class="vertical_line" viewBox="0 0 1 60"><path fill="transparent" stroke="#E1E1E1" stroke-width="30px" stroke-linejoin="miter"stroke-linecap="butt" stroke-miterlimit="4" shape-rendering="auto" d="M 0 0 L 0 60"></path></svg>';
                input_partial += '<div class="main_total_table_column"><div class="main_total_table_column_date ' + className + '">';
                input_partial += '<span>' + column_partial[i] + '</span></div><div class="main_total_table_column_count"><span>' + column_data_partial[i] + ' 곳</span></div></div>';
            }

            $(style + "</style>").appendTo("head");
            $('#main_total_table_all').html(input);
            $('#main_total_table_partial').html(input_partial);

            let list_input = '';
            for (let i = 2; i < data.SheetNames.length; i++) {
                let district_data = univ_data[data.SheetNames[i]];
                list_input += '<div class="main_univ_list_city"><span>';
                list_input += data.SheetNames[i];
                list_input += '</span></div><div class="div_main_univ_list_table"><ul class="main_univ_list_table">';
                for (let j = 0; j < district_data.length; j++) {
                    let tmp = district_data[j];

                    list_input += '<li><span class="main_list_univ_name" onclick="list_click(\'' + tmp['대학명'] + '\')">' + tmp['대학명'];
                    if (tmp['업데이트'] === 'N') list_input += '<div class="update_mark"></div>';
                    // if(tmp['업데이트']==='N') list_input += '<div class="update_mark">N</div>';
                    list_input += '</span><span class="' + color_class_all[tmp['group']] + '">' + tmp['개강일'];
                    if (tmp['제한적 대면'] === 'O') list_input += '<div class="main_f_f">(제한적 대면)</div>';
                    list_input += '</span></li>';
                }
                if (district_data.length % 2 == 1) list_input += '<li></li>';
                list_input += '</ul></div>';
            }
            $('#main_univ_list').html(list_input);
            // order_list_by_group("4월");
        });


    });
    if (location.hash == '#univ') location.href = "";
    window.addEventListener("hashchange", () => {
        if (window.location.hash == "#univ") goPage("#main", '#univ');
        else goPage('#univ', '#main');
    }, false);



    $("#main_search_input").keyup(function (e) {
        if (e.keyCode == 13) {
            if (!isFocus) search();
            else isFocus = false;
        }

    });
    $('#main_search_icon').on("click", search);
    $('#arrow_icon').on("click", function () {
        history.back();
    })
    $('#univ_header_title_mobile').on("click", function () {
        $('html, body').animate({ scrollTop: 0 }, 400, "easeOutQuart");
    })
    $('#team_email').on("click", copyToClipboard);

    $('#_2gloo_instagram').on("click", () => { window.open('https://www.instagram.com/univ_2gloo/') });
    $('#univ_main_1_2_go2gloo').on("click", () => { window.open('https://www.2gloo.kr/') });
    $('#univ_main_1_2_goUniv').on("click", () => {
        if ($('#univ_url').val() !== '') window.open($('#univ_url').val());
    });
    
    $('#notice_2gloo_instagram').on("click", () => { window.open('https://www.instagram.com/univ_2gloo/') });
    $('#survey_introApp').on("click", () => { window.open('https://www.2gloo.kr/') });

    $("input[name='survey_result']").on('change', () => {
        $("#survey_submit").addClass("enabled");

    });
   
    $('#main_btn_all').on("click",()=>{
        if (!$("#main_btn_all").hasClass("active")) {
            $("#main_btn_all").addClass("active");
            $("#main_btn_partial").removeClass("active");
            // $('.main_category_partial').hide();
            // $('.main_category_all').show();
            $(".main_category_partial").fadeOut(200);
            $(".main_category_all").delay(200).fadeIn(200);
        }
    });
    $('#main_btn_partial').on("click",()=>{
        if (!$("#main_btn_partial").hasClass("active")) {
            $("#main_btn_partial").addClass("active");
            $("#main_btn_all").removeClass("active");
            // $('.main_category_all').hide();
            // $('.main_category_partial').show();
            $(".main_category_all").fadeOut(200);
            $(".main_category_partial").delay(200).fadeIn(200);
        }
    });
    $('#univ_btn_all').on("click",()=>{
        if (!$("#univ_btn_all").hasClass("active")) {
            $("#univ_btn_all").addClass("active");
            $("#univ_btn_partial").removeClass("active");
            // $('.univ_category_partial').hide();
            // $('.univ_category_all').show();
            $(".univ_category_partial").fadeOut(200);
            $(".univ_category_all").delay(200).fadeIn(200);
            
        }
    });
    $('#univ_btn_partial').on("click",()=>{
        if (!$("#univ_btn_partial").hasClass("active")) {
            $("#univ_btn_partial").addClass("active");
            $("#univ_btn_all").removeClass("active");
            // $('.univ_category_all').hide();
            // $('.univ_category_partial').show();
            $(".univ_category_all").fadeOut(200);
            $(".univ_category_partial").delay(200).fadeIn(200);
            
        }
    });

    $("textarea[name='opinion']").on("propertychange change keyup paste input", (e) => {
        if (e.target.value.length > 0) {
            if (!$("#opinion_submit").hasClass("enabled")) $("#opinion_submit").addClass("enabled");
        }
        else {
            $("#opinion_submit").removeClass("enabled");
        }
    });
    $("#survey_submit").on("click", () => {
        if ($("#survey_submit").hasClass("enabled")) {           
            
            result =$("#survey_form").serialize();
            $("#div_survey").fadeOut(200);
            $("#div_opinion").delay(200).fadeIn(200);           
        }
    })
    $('#close_icon').on("click", ()=>{
        closeNotice();
    });
    $("#opinion_submit").on("click", () => {
        if ($("#opinion_submit").hasClass("enabled")) {
            closeNotice();        
        }
    })
});