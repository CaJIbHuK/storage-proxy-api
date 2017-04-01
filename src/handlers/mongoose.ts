import {connect} from "lib/mongoose";

export default {
  name : "mongoose",
  init : () => connect()
};