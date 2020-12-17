/**
 * WorksNav Methods
 */
worksNavData = {
    wnb_d1: [
        { num:"1", txt:"2021", url:"main.html", state:"" },
        {
            num:"2", txt:"2020", url:"works_001.html", state:"",
            wnb_d2:[
                {num:"1", txt:"1", url:"works_001.html", state:""},
                {num:"2", txt:"2", url:"works_002.html", state:""},
            ]
        },
        { num:"3", txt:"2019", url:"", state:"" },
        { num:"4", txt:"2018", url:"", state:"" },
        { num:"5", txt:"2017", url:"", state:"" },
        { num:"6", txt:"2016", url:"", state:"" }
    ]
};
function drawWorksNav(){ //handlebars draw
    //reference
    let hndBrWrap=$(".wnb_d1_wrap");
    let hndBrSource=$("#drawWorksNavTmp").html();
    let hndBrCompileTemp=Handlebars.compile(hndBrSource);
    hndBrWrap.empty().html(hndBrCompileTemp(worksNavData));
}