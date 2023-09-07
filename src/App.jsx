import "./App.css"

import React, { useState, useEffect } from 'react';
import BarChart from "./components/BarChart";
const App = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("/dataFGO.json")
      .then((response) => response.json())
      .then((jsonData) => {

        setData(jsonData);
      })
  }, []);


  //console.log(data);

  const optionsClass = [
    { value: "Saber", label: "Saber" },
    { value: "Archer", label: "Archer" },
    { value: "Lancer", label: "Lancer" },
    { value: "Rider", label: "Rider" },
    { value: "Assassin", label: "Assassin" },
    { value: "Caster", label: "Caster" },
    { value: "Berserker", label: "Berserker" },
    { value: "Ruler", label: "Ruler" },
    { value: "Extra", label: "Extra" },
  ];

  const optionsNPEffect = [
    { value: "all", label: "all" },
    { value: "only", label: "only" },
    { value: "support", label: "support" }
  ];

  const optionsNPType = [
    { value: "Buster", label: "Buster" },
    { value: "Arts", label: "Arts" },
    { value: "Quick", label: "Quick" }
  ];


  // チェックボックスの状態を管理するやつ
  const ClassCheckedState = Object.fromEntries(
    optionsClass.map((option) => [option.value, false])
  );

  const NPEffectChekedState = Object.fromEntries(
    optionsNPEffect.map((option) => [option.value, false])
  );

  const NPTypeState = Object.fromEntries(
    optionsNPType.map((option) => [option.value, false])
  );

  //console.log(ClassCheckedState);
  const [classChecked, setClassChecked] = useState(ClassCheckedState);
  const [NPEffectChecked, setNPEffectCheked] = useState(NPEffectChekedState);
  const [NPTypeChecked, setNPTypeChecked] = useState(NPTypeState);

  //console.log(classChecked);
  //console.log(NPEffectChecked);
  //console.log(NPTypeChecked);

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    //console.log(isChecked);

    if (optionsClass.find((item) => item.value === value)) {
      setClassChecked((prevState) => ({
        ...prevState,
        [value]: isChecked
      }));
    } else if (optionsNPEffect.find((item) => item.value === value)) {
      setNPEffectCheked((prevState) => ({
        ...prevState,
        [value]: isChecked
      }));
    } else if (optionsNPType.find((item) => item.value === value)){
      setNPTypeChecked((prevState) => ({
        ...prevState,
        [value]: isChecked
      }));
    }
  };

  //console.log(NPTypeChecked);

  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  };



  const calculateDaysFromToday = (data) => {
    const today = new Date(); // 現在の日付
    return data.map((d) => {
      const date = parseDate(d.days); // 日付をDateオブジェクトに変換
      const timeDiff = today - date; // 現在の日付との差分を計算
      //console.log(data);
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return {
        ...d,
        days: daysDiff,
      };
    });
  };


  const [calculatedData, setCalculatedData] = useState([]);

  useEffect(() => {
    if (data) {
      const a = calculateDaysFromToday(data)
      //console.log(a);
      setCalculatedData(a);
    }
  }, [data]);


  // チェックボックスからフィルタリング
  const filterData = () => {
    const selectedClasses = optionsClass.filter((item) => classChecked[item.value]).map((item) => item.value);
    const selectedNPEffect = optionsNPEffect.filter((item) => NPEffectChecked[item.value]).map((item) => item.value);
    const selectedNPType = optionsNPType.filter((item) => NPTypeChecked[item.value]).map((item) => item.value);
    //console.log(selectedClasses);

    if (selectedClasses.length === 0 && selectedNPEffect.length === 0 && selectedNPType.length === 0) {
      return calculatedData;
    } else if (selectedClasses.length > 0 && selectedNPEffect.length === 0 && selectedNPType.length === 0) {

      return calculatedData.filter((d) => selectedClasses.includes(d.class));

    } else if(selectedClasses.length > 0 && selectedNPEffect.length > 0 && selectedNPType.length === 0){
      return calculatedData.filter((d) => selectedClasses.includes(d.class) && selectedNPEffect.includes(d.NPeffect));

    } else if (selectedClasses.length > 0 && selectedNPEffect.length === 0 && selectedNPType.length > 0){
      return calculatedData.filter((d) => selectedClasses.includes(d.class) && selectedNPType.includes(d.NPtype));
    } else if (selectedClasses.length === 0 && selectedNPEffect.length > 0 && selectedNPType.length === 0) {

      return calculatedData.filter((d) => selectedNPEffect.includes(d.NPeffect));
    } else if (selectedClasses.length === 0 && selectedNPEffect.length > 0 && selectedNPType.length > 0) {

      return calculatedData.filter((d) => selectedNPEffect.includes(d.NPeffect) && selectedNPType.includes(d.NPtype));
    } else if (selectedClasses.length === 0 && selectedNPEffect.length === 0 && selectedNPType.length > 0) {

      return calculatedData.filter((d) => selectedNPType.includes(d.NPtype));
    } else {

      return calculatedData.filter((d) => selectedClasses.includes(d.class) && selectedNPEffect.includes(d.NPeffect) && selectedNPType.includes(d.NPtype));
    }

  };


  const filteredData = filterData();
  //console.log(filteredData);
  //console.log(calculatedData);


  return (
    <div >
      <h1>FGO don't PickUp</h1>
      <div >
        <div>
          <h3>クラス</h3>
          {optionsClass.map((option) => (
            <label key={option.value} style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                value={option.value}
                checked={classChecked[option.value]}
                onChange={handleCheckboxChange}
              />
              {option.label}

            </label>
          ))}
        </div>


        <div>
          <h3>宝具種類</h3>
          {optionsNPEffect.map((option) => (
            <label key={option.value} style={{ marginRight: "10px" }} >
              <input
                type="checkbox"
                value={option.value}
                checked={NPEffectChecked[option.value]}
                onChange={handleCheckboxChange}
              />
              {option.label}
            </label>
          ))}
          
        </div>

        <div>
          <h3>宝具カードタイプ</h3>
          {optionsNPType.map((option) => (
            <label key={option.value} style={{ marginRight: "10px" }} >
              <input
                type="checkbox"
                value={option.value}
                checked={NPTypeChecked[option.value]}
                onChange={handleCheckboxChange}
              />
              {option.label}
            </label>
          ))}
        </div>

      </div>
      {<BarChart data={filteredData} />}
    </div>
  );
};

export default App;