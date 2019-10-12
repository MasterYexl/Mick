function Mick(times, func, preFunc, intervalTime, endFunc) {
    let funcList = new Array(times);
    let preFuncList = new Array(times);
    let intervalTimeList = new Array(times);
    let disable = false;

    changeFunc(func);
    changeTime(intervalTime);
    changePreFunc(preFunc);
    changeEndFunc(endFunc);

    let grade = 0;
    let startTime = 0;
    let sto = null;
    let tmpTime = 0;
    let activeTimes = 0;

    this.activate = function () {
        judge();
    };
    this.changeTimes = function (new_times) {
        times = new_times;
    };
    this.changeIntervalTime = function (intervalTime) {
        changeTime(intervalTime);
    };
    this.changeFunc = function (func) {
        changeFunc(func);
    };
    this.changePreFunc = function (preFunc) {
        changePreFunc(preFunc);
    };
    this.changeEndFunc = function (func) {
        changeEndFunc(func);
    };
    this.getTimes = function () {
        return grade;
    };
    this.getActiveTimes = function () {
        return activeTimes;
    };
    this.endImmediately = function () {
        doFunc();
    };
    this.disableImmediately = function () {
        clearTimeout(sto);
        startTime = 0;
        tmpTime = 0;
        disable = true;
    };
    this.disable = function () {
        disable = true;
    };
    this.enable = function () {
        disable = false;
    };

    function changeEndFunc(func) {
        if (func === "" || func === null||func===undefined) return;
        if (func.search(/\(.*\)/) === -1) func += "()";
        func += ";";
        endFunc = func;
    }

    function changeTime(intervalTime) {
        if (intervalTime != null) {
            let intervalTimes = intervalTime.split(/[ ;]/);
            for (let i = 0; i < intervalTimes.length; i++) {
                parseArray(intervalTimes, intervalTimeList, i);
            }
        }
    }

    function parseFunc(func, funcList) {
        let tmpFuncList = null;
        if (func != null) tmpFuncList = func.split(/[ ;]/);
        else return;
        for (let i = 0; tmpFuncList != null && i < tmpFuncList.length; i++) {
            if (tmpFuncList[i] === "null" || tmpFuncList[i] === "") continue;
            if (tmpFuncList[i].search(/\(.*\)/) === -1) tmpFuncList[i] += "()";
            tmpFuncList[i] += ";";
            parseArray(tmpFuncList, funcList, i);
        }
    }

    function parseArray(tmpFuncList, funcList, nub) {
        if (tmpFuncList[nub].search(/\[.*]/) !== -1) {
            let infos = tmpFuncList[nub].split("]");
            infos[0] = infos[0].substring(1);
            if (infos[0].search(",")===-1) {
                funcList[infos[0]] = infos[1];
                return;
            }
            let info = infos[0].split(",");
            let st = info[0];
            let ed = info[1];
            for (let j = st; j < ed; j++) {
                funcList[j] = infos[1];
            }
        } else funcList[nub] = tmpFuncList[nub];
    }

    function changeFunc(func) {
        parseFunc(func, funcList);
    }

    function changePreFunc(preFunc) {
        parseFunc(preFunc, preFuncList);
    }

    function judge() {
        if (disable) return;
        let cha;
        if (startTime === 0) startTime = new Date().getTime();
        if (grade < times) {
            let thisTime = new Date().getTime() - startTime;
            cha = thisTime - tmpTime;
            tmpTime = thisTime;
            if (sto != null) clearTimeout(sto);
            grade++;
        }
        if (preFuncList != null && grade - 1 < preFuncList.length) eval(preFuncList[grade - 1]);
        if (grade >= times) {
            doFunc();
            return;
        }
        if (cha === 0) cha = 170;
        if (intervalTimeList != null && grade - 1 < intervalTimeList.length) {
            let itt = intervalTimeList[grade-1];
            if (itt !== "auto" && itt !== "" && itt !== 0 && itt !== undefined) cha = parseInt(itt);
        }
        func_time(cha + 30);
    }

    function func_time(time) {
        sto = setTimeout(function () {
            doFunc();
            clearTimeout(sto);
        }, time)
    }

    function doEndFunc() {
        if (endFunc !== null) eval(endFunc);
    }

    function doFunc() {
        activeTimes = grade;
        grade = 0;
        let acFunc = funcList[activeTimes - 1];
        try {
            if (activeTimes !== 0 || activeTimes <= times) {
                eval(acFunc);
                doEndFunc();
            }
        } catch (e) {
            acFunc = acFunc.replace(/,/g, "','");
            acFunc = acFunc.replace("(", "('");
            acFunc = acFunc.replace(")", "')");
            if (activeTimes !== 0 || activeTimes <= times) {
                eval(acFunc);
                doEndFunc();
            }
        }
        startTime = 0;
        tmpTime = 0;
    }
}