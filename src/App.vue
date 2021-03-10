<template>
  <div class="flex flex-col items-center justify-center">
    <input
      class="py-2 px-4 mt-8 w-6/12 font-semibold rounded-lg shadow-md"
      placeholder="Filter assets..."
      v-model="searchedAsset"
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
    <div class="flex w-3/12 items-center justify-around">
      <button
        class="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md"
        @click="pageBackwards"
        v-if="page > 1"
      >
        Prev
      </button>
      <button
        class="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md"
        @click="pageForwards"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { getAssests, subscribeToPricesChange } from "./services/api";

export default {
  name: "App",
  data() {
    return {
      assets: [],
      columns: ["Rank", "Name", "Price", "Change (24Hr)"],
      page: 1,
      numberOfAssetsPerPage: 10,
      searchedAsset: ""
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
    fitleredAssets() {
      return this.assets.filter(asset =>
        asset.name.toLowerCase().includes(this.searchedAsset.toLowerCase())
      );
    },
    assetsList() {
      return this.fitleredAssets.slice(this.startIndex, this.endIndex);
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
