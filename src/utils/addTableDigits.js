import { stringify } from "postcss";

export function addTableDigits(originalId) {
  if (originalId < 10) {
    let tableIdNumber = "00000" + stringify(originalId);
  } else if (originalId < 100) {
    let tableIdNumber = "0000" + stringify(originalId);
  } else if (originalId < 1000) {
    let tableIdNumber = "000" + stringify(originalId);
  } else if (originalId < 10000) {
    let tableIdNumber = "00" + stringify(originalId);
  } else if (originalId < 100000) {
    let tableIdNumber = "0" + stringify(originalId);
  }
  return tableIdNumber;
}
