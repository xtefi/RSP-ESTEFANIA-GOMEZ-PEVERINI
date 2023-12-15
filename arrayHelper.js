export default function Arr_Update(arr, objectToUpdate, updatedObject) {
  const index = arr.findIndex(obj => obj.id === objectToUpdate.id);

  if (index !== -1) {
    arr[index] = updatedObject;
  }
}
export function Arr_GetAllUniqueProps(arr) {
  let props = arr
    .map(x => Object.getOwnPropertyNames(x))
    .flat();
  props = [...new Set(props)];
  return props;
}