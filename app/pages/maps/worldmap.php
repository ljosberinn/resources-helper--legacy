<!-- #module-worldmap -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-worldmap">

  <select class="custom-select" id="worldmap-selector">
    <option selected="" disabled="">select resource</option>
      <option value="0">Clay</option>
      <option value="1">Limestone</option>
      <option value="2">Gravel</option>
      <option value="3">Coal</option>
      <option value="4">Iron ore</option>
      <option value="5">Crude oil</option>
      <option value="6">Quartz sand</option>
      <option value="7">Chalcopyrite</option>
      <option value="8">Bauxite</option>
      <option value="9">Lithium ore</option>
      <option value="10">Ilmenite</option>
      <option value="11">Silber ore</option>
      <option value="12">Gold ore</option>
      <option value="13">Rough diamonds</option>
  </select>

  <p class="lead text-center" id="worldmap-info">Click on a mine to receive additional info!</p>

  <div class="rounded" id="worldmap">
    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" style="background:0 0" viewBox="0 0 100 100">
      <g transform="translate(50 50)">
        <g transform="matrix(.6 0 0 .6 -19 -19)">
          <g transform="rotate(242)">
            <animateTransform attributeName="transform" begin="0s" dur="3s" keyTimes="0;1" repeatCount="indefinite" type="rotate" values="0;360"/>
            <path fill="#9acd32" d="M37.3496988-7h10V7h-10a38 38 0 0 1-1.50391082 5.61267157l8.66025404 5-7 12.12435565-8.66025404-5a38 38 0 0 1-4.10876076 4.10876076l5 8.66025404-12.12435565 7-5-8.66025404A38 38 0 0 1 7 37.34969879v10H-7v-10a38 38 0 0 1-5.61267157-1.50391081l-5 8.66025404-12.12435565-7 5-8.66025404a38 38 0 0 1-4.10876076-4.10876076l-8.66025404 5-7-12.12435565 8.66025404-5A38 38 0 0 1-37.34969879 7h-10V-7h10a38 38 0 0 1 1.50391081-5.61267157l-8.66025404-5 7-12.12435565 8.66025404 5a38 38 0 0 1 4.10876076-4.10876076l-5-8.66025404 12.12435565-7 5 8.66025404A38 38 0 0 1-7-37.34969879v-10H7v10a38 38 0 0 1 5.61267157 1.50391081l5-8.66025404 12.12435565 7-5 8.66025404a38 38 0 0 1 4.10876076 4.10876076l8.66025404-5 7 12.12435565-8.66025404 5A38 38 0 0 1 37.34969879-7M0-30a30 30 0 1 0 0 60 30 30 0 1 0 0-60"/>
          </g>
        </g>
        <g transform="matrix(.6 0 0 .6 19 19)">
          <g transform="rotate(103)">
            <animateTransform attributeName="transform" begin="-0.125s" dur="3s" keyTimes="0;1" repeatCount="indefinite" type="rotate" values="360;0"/>
            <path fill="coral" d="M37.3496988-7h10V7h-10a38 38 0 0 1-1.50391082 5.61267157l8.66025404 5-7 12.12435565-8.66025404-5a38 38 0 0 1-4.10876076 4.10876076l5 8.66025404-12.12435565 7-5-8.66025404A38 38 0 0 1 7 37.34969879v10H-7v-10a38 38 0 0 1-5.61267157-1.50391081l-5 8.66025404-12.12435565-7 5-8.66025404a38 38 0 0 1-4.10876076-4.10876076l-8.66025404 5-7-12.12435565 8.66025404-5A38 38 0 0 1-37.34969879 7h-10V-7h10a38 38 0 0 1 1.50391081-5.61267157l-8.66025404-5 7-12.12435565 8.66025404 5a38 38 0 0 1 4.10876076-4.10876076l-5-8.66025404 12.12435565-7 5 8.66025404A38 38 0 0 1-7-37.34969879v-10H7v10a38 38 0 0 1 5.61267157 1.50391081l5-8.66025404 12.12435565 7-5 8.66025404a38 38 0 0 1 4.10876076 4.10876076l8.66025404-5 7 12.12435565-8.66025404 5A38 38 0 0 1 37.34969879-7M0-30a30 30 0 1 0 0 60 30 30 0 1 0 0-60"/>
          </g>
        </g>
      </g>
    </svg>
  </div>

</div>
