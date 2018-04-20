<!-- #module-qualitycomparator -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-qualitycomparator">

    <h6><span class="nav-icon-qualitycomparator"></span> Quality Comparator</h6>
    <hr class="mb-3">

    <div class="row justify-content-center">
        <div class="col-xs-6 col-md-6">

        <table class="table table-responsive table-break-medium table-striped">
            <thead>
                <tr class="small">
                    <th>Type</th>
                    <th class="text-center">Quality</th>
                    <th class="text-right">Income/hour</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td data-th="Type / Quality / Income/hour" colspan="3">
                        <div class="input-group">
                            <select class="custom-select input-group-addon" id="qualitycomparator-selector">
                                <option selected disabled>select resource</option>
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

                            <input type="number" min="0" max="100" id="qualitycomparator-quality" class="form-control text-sm-left text-md-right" placeholder="e.g. 99.87" aria-label="quality of current scan">

                            <span class="input-group-addon" id="qualitycomparator-income">0</span>
                        </div>
                    </td>
                </tr>

                <?php

                for ($i = 0; $i <= 13; $i += 1) {

                    echo '
                    <tr>
                        <td data-th="Minimum required quality" colspan="3" class="text-center">
                            <span class="resources-material-' .$i. '"></span>
                            <span id="qualitycomparator-' .$i. '">0%</span>
                        </td>
                    </tr>';

                }

                ?>

            </tbody>
        </table>
        </div>
    </div>
</div>
