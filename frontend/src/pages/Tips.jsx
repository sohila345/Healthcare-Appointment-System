import React, { useState } from "react";

const healthTips = [
  {
    disease: "Heart and Vascular Diseases",
    type: "Chronic",
    risks: "High blood pressure, obesity, high cholesterol, smoking",
    tips: "Exercise 30 min/day, eat a healthy low-fat & low-salt diet, avoid smoking & alcohol, monitor blood pressure & cholesterol regularly",
  },
  {
    disease: "Stroke",
    type: "Chronic",
    risks: "High blood pressure, diabetes, obesity, smoking",
    tips: "Monitor BP & blood sugar, stay physically active, eat fiber-rich foods, maintain healthy weight, avoid smoking",
  },
  {
    disease: "Cancer (Lung, Breast, Colon, Liver, Stomach)",
    type: "Chronic",
    risks: "Smoking, obesity, family history, unhealthy diet",
    tips: "Don’t smoke, eat fruits & vegetables, maintain healthy weight, undergo regular screenings for early detection",
  },
  {
    disease: "Type 2 Diabetes",
    type: "Chronic",
    risks: "Obesity, sedentary lifestyle, unhealthy diet",
    tips: "Maintain healthy weight, follow a balanced low-sugar diet, exercise regularly, monitor blood sugar levels",
  },
  {
    disease: "Chronic Lung Diseases (COPD, Asthma)",
    type: "Chronic",
    risks: "Smoking, air pollution, previous lung infections",
    tips: "Avoid smoking, protect against dust & chemicals, practice breathing exercises, treat lung infections promptly",
  },
  {
    disease: "HIV/AIDS",
    type: "Infectious",
    risks: "Unsafe sexual activity, sharing needles",
    tips: "Use condoms, don’t share needles, get tested regularly, start treatment early if diagnosed",
  },
  {
    disease: "Malaria",
    type: "Infectious",
    risks: "Exposure to mosquitoes in endemic areas",
    tips: "Use insecticide-treated nets, avoid mosquito bites, take preventive medication when traveling",
  },
  {
    disease: "Severe Respiratory Infections (COVID-19, Influenza)",
    type: "Infectious",
    risks: "Contagious virus, crowded places",
    tips: "Wash hands frequently, wear masks, ventilate indoor spaces, get recommended vaccines",
  },
  {
    disease: "Chronic Liver Diseases (Cirrhosis, Hepatitis)",
    type: "Chronic",
    risks: "Alcohol, hepatitis, obesity",
    tips: "Avoid alcohol, get hepatitis B vaccination, maintain healthy weight, don’t share personal items",
  },
  {
    disease: "Kidney Diseases (Chronic Kidney Disease, Stones)",
    type: "Chronic",
    risks: "Diabetes, high blood pressure, dehydration",
    tips: "Stay hydrated, control blood sugar & BP, avoid excessive salt, regular kidney function tests",
  },
  {
    disease: "Hypertension",
    type: "Chronic",
    risks: "Obesity, high salt diet, stress",
    tips: "Monitor BP regularly, reduce salt, exercise, maintain healthy weight, manage stress",
  },
  {
    disease: "Obesity",
    type: "Chronic",
    risks: "Unhealthy diet, sedentary lifestyle, genetics",
    tips: "Balanced diet, regular exercise, limit sugary & fatty foods, monitor weight",
  },
  {
    disease: "Osteoporosis",
    type: "Chronic",
    risks: "Aging, low calcium & vitamin D, sedentary lifestyle",
    tips: "Consume calcium & vitamin D, exercise with weight-bearing activity, avoid smoking & excessive alcohol",
  },
  {
    disease: "Depression & Anxiety Disorders",
    type: "Neurological / Mental",
    risks: "Stress, genetics, trauma",
    tips: "Maintain social connections, exercise, seek professional help, practice relaxation techniques",
  },
  {
    disease: "Tuberculosis (TB)",
    type: "Infectious",
    risks: "Weak immune system, crowded living conditions, malnutrition",
    tips: "Vaccination (BCG), proper ventilation, complete prescribed antibiotics, healthy diet",
  },
  {
    disease: "Dengue Fever",
    type: "Infectious",
    risks: "Mosquito exposure in endemic areas",
    tips: "Use mosquito nets and repellents, avoid stagnant water, seek early medical care if symptoms appear",
  },
  {
    disease: "Cholera",
    type: "Infectious",
    risks: "Contaminated water & food, poor sanitation",
    tips: "Drink clean water, practice hygiene, cook food properly, vaccination in high-risk areas",
  },
  {
    disease: "Chronic Liver Diseases",
    type: "Liver",
    risks: "Alcohol, hepatitis, obesity",
    tips: "Avoid alcohol, get hepatitis B vaccination, maintain healthy weight, don’t share personal items",
  },
  {
    disease: "Neurological Diseases (Alzheimer’s, Parkinson’s)",
    type: "Neurological",
    risks: "Aging, chronic diseases, low mental activity",
    tips: "Keep mentally active (reading, brain games), eat omega-3-rich foods, exercise regularly, manage chronic conditions",
  }, {
    disease: "Chronic Lung Diseases (COPD)",
    type: "Respiratory",
    risks: "Smoking, air pollution, previous lung infections",
    tips: "Avoid smoking, protect against dust & chemicals, practice breathing exercises, treat lung infections promptly",
  },
];

const types = ["All", "Chronic", "Infectious", "Neurological", "Respiratory", "Liver"];

const Tips = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [filter, setFilter] = useState("All");

  // فلترة حسب النوع فقط
  const filteredTips = healthTips.filter(
    (item) => filter === "All" || item.type === filter
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">
        Serious Diseases & Prevention Tips
      </h1>

      {/* مسافة فارغة مكان Search */}
      <div className="mb-20"></div>

      {/* Filter Buttons */}

<div className="flex flex-wrap justify-center mb-6 gap-3">
  {types.map((t) => (
    <button
      key={t}
      onClick={() => setFilter(t)}
      className={`px-4 py-2 rounded-full border ${
        filter === t
          ? "bg-primary text-white"  // الزر المحدد الآن يستخدم لون الخلفية primary
          : "bg-white text-primary"   // الزر الغير محدد يستخدم نص باللون primary
      } hover:bg-primary hover:text-white transition`}
    >
      {t}
    </button>
  ))}
</div>

      {/* Disease Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {filteredTips.length > 0 ? (
          filteredTips.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 mb-6"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {index + 1}. {item.disease}
                </h2>
                <span className="text-blue-600 font-bold">
                  {expandedIndex === index ? "-" : "+"}
                </span>
              </div>

              {expandedIndex === index && (
                <div className="mt-4 text-gray-700 space-y-3">
                  <p>
                    <span className="font-semibold">Type:</span> {item.type}
                  </p>
                  <p>
                    <span className="font-semibold">Risk Factors:</span>{" "}
                    {item.risks}
                  </p>
                  <p>
                    <span className="font-semibold">Prevention Tips:</span>{" "}
                    {item.tips}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No diseases found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Tips;