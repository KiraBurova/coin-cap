<template>
  <div class="container mx-auto">
    <table class="table-fixed w-full">
      <thead>
        <tr class="h-14 border-2 border-gray-200 rounded-md bg-gray-200">
          <th class="w-1/4" v-for="column in columns" :key="column">
            {{ column }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="asset in assets"
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
  </div>
</template>

<script>
import { getAssests, subscribeToPricesChange } from "./services/api";

export default {
  name: "App",
  data() {
    return {
      assets: [],
      columns: ["Rank", "Name", "Price", "Change (24Hr)"]
    };
  },
  created() {
    this.setAssetsToData();
    this.subscribeToNewPricesByWS();
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
    }
  }
};
</script>

<style></style>
