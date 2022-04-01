export const environment = {
  production: true,
  type: 'PROD',

  BASE_URL_PUBLIC: 'https://api.miportalb2b.com/public/v1/public/api/cpg/001/country/',
  BASE_URL_INTERNAL: 'https://api.miportalb2b.com/internal/v1/internal/api/cpg/001/country/',
  // TODO change mmc to mcc
  BASE_URL_INTEGRATIONS: 'https://999ayvt81m.execute-api.us-east-1.amazonaws.com/dev/v1/internal/api/mcc/auth/cpg/001/country/',

  AWS_IDENTITY_POOL_ID: 'us-east-1:3a95aa5d-12ad-41bd-8206-2db77f2f2848',
  AWS_REGION: 'us-east-1',
  AWS_USER_POOL_ID: 'us-east-1_BHJiYNNhb',
  AWS_CLIENT_ID: '5jtgc1a573nlac70s8088llohj',

  AES_KEY: 'aNdRgUkXp2s5v8y/B?E(H+MbQeShVmYq3t6w9z$C&F)J@NcRfUjWnZr4u7x!A%D*',

  IMG_S3_HOST: 'https://b2b-product-images-prod.s3.amazonaws.com/',

  GTM_ID: 'GTM-W6TG6DB',

  TYC_S3_HOST: 'https://b2b-frontend-ui-prod.s3.amazonaws.com/',
};
