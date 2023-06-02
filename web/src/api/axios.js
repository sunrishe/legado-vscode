import axios from "axios";
import WEB from "@/api/web";

const SECOND = 1000;

const ajax = axios.create({
  baseURL: WEB.getLegadoWebServeUrl(),
  timeout: 120 * SECOND,
});

export default ajax;
