<div class="row">
    <div class="col-xs-12 col-md-12">

        <table class="table table-responsive table-break-medium mb-3">
            <tbody>
            <tr>
                <td class="sorttable_nosort">
                    <button class="btn btn-success" id="tradelog-previous">previous day</button>
                </td>
                <td class="text-center">
                    <select class="custom-select" id="tradelog-filter-day">
                        <option selected disabled id="tradelog-filter-txt">jump to day X</option>
                    </select>
                </td>
                <td class="sorttable_nosort <?php echo $textOrientation; ?>">
                    <button class="btn btn-success" id="tradelog-next" disabled>next day</button>
                </td>
            </tr>
            </tbody>
        </table>

        <table class="table table-responsive table-break-medium table-striped mb-3">
            <thead>
            <tr class="small">
                <th id="tradelog-simple-th-0">Resource</th>
                <th id="tradelog-simple-th-1" class="text-md-right text-sm-left">Bought for...</th>
                <th id="tradelog-simple-th-2" class="text-md-right text-sm-left">Sold for...</th>
                <th id="tradelog-simple-th-3" class="text-md-right text-sm-left">Profit of selected day</th>
            </tr>
            </thead>
            <tbody id="tradelog-simple-tbody"></tbody>
            <tfoot id="tradelog-simple-tfoot"></tfoot>
        </table>
    </div>
</div>
