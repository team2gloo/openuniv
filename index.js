let isFocus = false;
let univ_data = {};
let color_class = {};
let total_data;
// let sheetNames;
let chart2 = null;
let color_arr = ['#33CAEF', '#F5A623', '#8C89FF', '#688197', '#CF5948', '#A5CF29'];
function copyToClipboard() {
    var $temp = $("<input>");
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
            $("#univ_url").val(jQuery.trim(main_univ['홈페이지']));
            let district_total = total_data[total_data.findIndex(obj => obj[0] === selected.district)];



            var ctx2 = $("#univ_main_2_1_graph").get(0).getContext("2d");
            let column = Object.values(total_data[0]).slice(4);
            let column_data = Object.values(district_total).slice(4);
            var config = {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: column_data,
                        backgroundColor: color_arr.slice(0, column.length),
                        borderWidth: 0
                    }],
                    labels: column,
                },
                options: {
                    tooltips: {
                        bodyFontSize: 15,
                        bodyFontFamily: "yg-jalnan",
                        callbacks: {
                            label: function (tooltipItem, data) {
                                let per = (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] / district_total[3]) * 100;
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
            $('#univ_main_2_1_1_district').html(district_total[0]);
            $('#univ_main_3_district').html(district_total[0]);
            $('#univ_main_2_1_1_count').html(district_total[3]);
            $('#univ_main_2_1_1_date').html(district_total[1]);
            let date_input = '';
            let count_input = '';
            for (let i = 0; i < column.length; i++) {
                date_input += '<span class="' + color_class[column[i]] + '">' + column[i] + '</span>';
                count_input += '<span>' + column_data[i] + ' 곳</span>';
            }
            $('#univ_main_2_2_date').html(date_input);
            $('#univ_main_2_2_count').html(count_input);
            let list_univ_input = '';
            let list_date_input = '';
            for (let i = 0; i < district_data.length; i++) {
                let univ_date = district_data[i];
                list_univ_input += '<span>' + univ_date['대학명'] + '</span>';
                list_date_input += '<span class="' + color_class[univ_date['group']] + '">' + univ_date['개강일'] + '</span>';
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
    $(window).resize(function () {
        $(".ui-autocomplete").hide();
    });
    fetch('./data.xlsx?version=0423').then((res) => {
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
            var ctx = $("#main_graph_canvas").get(0).getContext("2d");
            let column = Object.values(total_data[0]).slice(4);
            let column_data = Object.values(total_data[1]).slice(4);
            var config = {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: column_data,
                        backgroundColor: color_arr.slice(0, column.length),
                        borderWidth: 0
                    }],
                    labels: column,
                },
                options: {

                    tooltips: {
                        bodyFontSize: 15,
                        bodyFontFamily: "yg-jalnan",
                        callbacks: {
                            label: function (tooltipItem, data) {
                                let per = (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] / total_data[1][3]) * 100;
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
            var chart = new Chart(ctx, config);
            $('#main_univ_count').html(total_data[1][3]);
            $('#main_update_date').html(total_data[1][1]);
            style += "._0 {color:" + color_arr[0] + "; !important} ";
            color_class[column[0]] = '_0';
            let input = '<div class="main_total_table_column"><div class="main_total_table_column_date _0">';
            input += '<span>' + column[0] + '</span></div><div class="main_total_table_column_count"><span>' + column_data[0] + ' 곳</span></div></div>';
            for (let i = 1; i < column.length; i++) {
                let className = "_" + i;
                color_class[column[i]] = className;
                style += "." + className + "{color:" + color_arr[i] + "; !important}";
                input += '<svg class="vertical_line" viewBox="0 0 1 60"><path fill="transparent" stroke="#E1E1E1" stroke-width="30px" stroke-linejoin="miter"stroke-linecap="butt" stroke-miterlimit="4" shape-rendering="auto" d="M 0 0 L 0 60"></path></svg>';
                input += '<div class="main_total_table_column"><div class="main_total_table_column_date ' + className + '">';
                input += '<span>' + column[i] + '</span></div><div class="main_total_table_column_count"><span>' + column_data[i] + ' 곳</span></div></div>';
            }
            $(style + "</style>").appendTo("head");
            $('#main_total_table').html(input);
            $('#offline_univ').html(total_data[1][2]);
            let list_input = '';
            for (let i = 2; i < data.SheetNames.length; i++) {
                let district_data = univ_data[data.SheetNames[i]];
                list_input += '<div class="main_univ_list_city"><span>';
                list_input += data.SheetNames[i];
                list_input += '</span></div><div class="div_main_univ_list_table"><ul class="main_univ_list_table">';
                for (let j = 0; j < district_data.length; j++) {
                    let tmp = district_data[j];
                    list_input += '<li><span class="main_list_univ_name" onclick="list_click(\'' + tmp['대학명'] + '\')">' + tmp['대학명'] + '</span><span class="' + color_class[tmp['group']] + '">' + tmp['개강일'] + '</span></li>'
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

});