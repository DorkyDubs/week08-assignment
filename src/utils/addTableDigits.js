import { stringify } from "postcss";

export function addTableDigits(originalId) {
  let tableIdNumber;
  const originalIdAsNumner = Number(originalId);
  if (originalIdAsNumner < 10) {
    tableIdNumber = "00000" + originalId;
  } else if (originalId < 100) {
    tableIdNumber = "0000" + originalId;
  } else if (originalId < 1000) {
    tableIdNumber = "000" + originalId;
  } else if (originalId < 10000) {
    tableIdNumber = "00" + originalId;
  } else if (originalId < 100000) {
    tableIdNumber = "0" + originalId;
  }
  return tableIdNumber;
}
