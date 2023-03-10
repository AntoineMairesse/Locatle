import { defineStore } from "pinia";
import type { Feature, FeatureCollection } from "geojson";

export const useGameStore = defineStore('game', {
  state: () => ({
    currentGuesses: [] as Array<string>,
    countryToGuess: '' as string,
    win: false as Boolean,
    countries: [] as Array<string>,
    countriesFeatures: [] as Array<Feature>,
    loading: false as Boolean
  }),
  actions: {
    setGuesses(guesses: Array<string>){
      this.currentGuesses = structuredClone(guesses);
      this.checkIfWon();
    },
    addGuess(guess: string){
      this.currentGuesses.push(guess);
      this.checkIfWon();
    },
    checkIfWon(){
      if(this.currentGuesses.includes(this.countryToGuess)) this.setWin(true);
    },
    setCountryToGuess(country: string){
      this.countryToGuess = country;
    },
    setWin(isWin: Boolean){
      this.win = isWin;
    },
    setLoading(isLoading: Boolean){
      this.loading = isLoading;
    },
    reset(){
      this.currentGuesses = [];
      this.countryToGuess = '';
      this.win = false;
    },
    resetGame(newCountry: string){
      this.countryToGuess = newCountry;
      this.currentGuesses = [];
      this.win = false;
    },
    getCountries(){
      if(this.countries.length){
        return new Promise(resolve => {
          resolve(true)
        });
      }
      return fetch('/countries.geojson').then(res => res.json()).then((countries: FeatureCollection) => {
        this.countriesFeatures = countries.features;
        this.countries = countries.features.map((country) => {
          return country.properties?.NAME
        })
      });
    }
  }
});