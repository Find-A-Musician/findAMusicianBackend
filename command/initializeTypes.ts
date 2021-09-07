import generateTypes from './generateType';

export default async function initializeTypes() {
  try {
    await generateTypes();
  } catch (err) {
    console.log('⚠️  An error has occured while generate type');
    console.log(err);
  }
}
