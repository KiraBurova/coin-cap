<template>
  <div class="flex flex-col items-center justify-center">
    <input
      class="py-2 px-4 mt-8 w-6/12 font-semibold rounded-lg shadow-md"
      placeholder="Filter assets..."
      v-model="filter"
    />
    <table class="table-auto border-collapse w-6/12 mb-8 mt-8 shadow-md">
      <thead>
        <tr class="h-14 border-2 border-gray-200 rounded-md bg-gray-200">
          <th class="w-1/4" v-for="column in columns" :key="column">
            {{ column }}
          </th>
        </tr>
      </thead>
      <tbody>
        <EmptyTablePlaceholder v-if="!assetsList.length" />
        <tr
          v-for="asset in assetsList"
          :key="asset.id"
          class="h-14 border-2 border-gray-200 rounded-md"
        >
          <td class="w-1/4 text-center">
            {{ asset.rank }}
          </td>
          <td class="w-1/4 text-center">
            {{ asset.name }}
          </td>
          <td
            class="w-1/4 text-center transition ease-in-out duration-300"
            :class="asset.increased ? 'text-green-600' : 'text-red-600'"
          >
            {{ (+asset.priceUsd).toFixed(2) }} $
          </td>
          <td class="w-1/4 text-center">
            {{ (+asset.changePercent24Hr).toFixed(2) }} %
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination
      :page="page"
      :showNextButton="showNextButton"
      @page-forwards="pageForwards"
      @page-backwards="pageBackwards"
    />
  </div>
</template>

<script>
import { getAssests, subscribeToPricesChange } from "./services/api";

import Pagination from "./components/Pagination";
import EmptyTablePlaceholder from "./components/EmptyTablePlaceholder";

export default {
  name: "App",
  components: { Pagination, EmptyTablePlaceholder },
  data() {
    return {
      assets: [],
      columns: ["Rank", "Name", "Price", "Change (24Hr)"],
      page: 1,
      numberOfAssetsPerPage: 10,
      filter: ""
    };
  },
  created() {
    this.setAssetsToData();
    this.subscribeToNewPricesByWS();
  },
  computed: {
    startIndex() {
      return (this.page - 1) * this.numberOfAssetsPerPage;
    },
    endIndex() {
      return this.page * this.numberOfAssetsPerPage;
    },
    filteredAssets() {
      return this.assets.filter(asset =>
        asset.name.toLowerCase().includes(this.filter.toLowerCase())
      );
    },
    assetsList() {
      return this.filteredAssets.slice(this.startIndex, this.endIndex);
    },
    showNextButton() {
      return this.filteredAssets.length > this.endIndex;
    }
  },
  watch: {
    filter() {
      this.page = 1;
    }
  },
  methods: {
    async setAssetsToData() {
      const assets = await getAssests();

      this.assets = assets;
    },
    subscribeToNewPricesByWS() {
      subscribeToPricesChange(newPrices => this.updateAssetsPrices(newPrices));
    },
    updateAssetsPrices(newPrices) {
      this.assets.forEach(asset => {
        const assetId = asset.id;
        const assetPrice = asset.priceUsd;
        const newPrice = newPrices[assetId];

        if (newPrice) {
          if (assetPrice > newPrice) {
            asset.increased = false;
          } else {
            asset.increased = true;
          }

          asset.priceUsd = newPrice;
        }
      });
    },
    pageForwards() {
      this.page += 1;
    },
    pageBackwards() {
      this.page -= 1;
    }
  }
};
</script>

<style></style>
