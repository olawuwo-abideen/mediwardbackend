import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './shared/exceptions/http.exception';
import { HttpResponseInterceptor } from './shared/interceptors/http-response.interceptor';
import { ValidationPipe } from '@nestjs/common';
// import * as compression from 'compression'; 

async function bootstrap() {
const app = await NestFactory.create(AppModule);

// exception filters
const { httpAdapter } = app.get(HttpAdapterHost);
app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));
app.useGlobalInterceptors(new HttpResponseInterceptor());
app.useGlobalPipes(new ValidationPipe({ transform: true }));

app.enableCors({
  origin: '*',
});

// app.use(compression());
// app.use(cookieParser());

const config = new DocumentBuilder()
.setTitle('Mediward')
.setDescription('Mediward API description')
.setVersion('0.1')
.addBearerAuth()
.build();

const document = SwaggerModule.createDocument(app, config);

SwaggerModule.setup("docs", app, document, {
customSiteTitle: "Api Docs",
customfavIcon: "https://avatars.githubusercontent.com/u/6936373?s=200&v=4",
customJs: [
"https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js",
"https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js",
],
customCssUrl: [
"https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
"https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css",
"https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css",
],
swaggerOptions: {
persistAuthorization: true,
},

});
// app.use(helmet())
app.getHttpAdapter().get('/', (_, res) => {
res.redirect('/docs');
});

await app.listen(3000);
}

bootstrap();

