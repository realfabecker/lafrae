#!/usr/bin/env node
import { HttpApp } from "handlers/http/HttpApp";

const app = new HttpApp();
app.register();
app.listen(3000);
