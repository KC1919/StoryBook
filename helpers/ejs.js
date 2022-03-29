const moment=require("moment");

module.exports={
    formatDate:(date,format)=>{
        return moment(date).format(format)
    },

    stripTags:(input)=>{
        return input.replace(/<(?:.|\n)*?>/gm,'');
    },

    trim:(s,len)=>{
        return s.length>len?s.substring(0,len)+"...":s;
    }
}