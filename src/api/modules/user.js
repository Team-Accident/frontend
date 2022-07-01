/* eslint-disable import/no-anonymous-default-export */
import { axiosClient, resolver } from '../client';

export default {
  signInUser(data) {
    return resolver(axiosClient.post('/user/signin', data));
  },
  signUpUser(data) {
    return resolver(axiosClient.post('/user/signup', data));
  },
};