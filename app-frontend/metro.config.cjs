const { getDefaultConfig } = require("expo/metro-config");
// Puntiamo direttamente al file che abbiamo visto nei tuoi screenshot
const { withNativeWind } = require("nativewind/dist/metro"); 

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { 
  input: "./global.css", // Assicurati che global.css sia nella root del frontend
  inlineStyles: true
});