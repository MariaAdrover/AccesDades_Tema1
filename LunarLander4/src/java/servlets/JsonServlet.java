package servlets;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonReader;
import configuraciones.Configuracion;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;
import java.lang.reflect.Type;
import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.JAXBException;

public class JsonServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        ServletContext context = getServletContext();
        String fullPath = context.getRealPath("/config.json");

        Gson gson = new Gson();
        
        Type listType = new TypeToken<List<Configuracion>>() {
        }.getType();
        List<Configuracion> listaConfiguraciones = gson.fromJson(new FileReader(fullPath), listType);
        
        String s = gson.toJson(listaConfiguraciones);
        response.setContentType("application/json");
        PrintWriter pw = response.getWriter();
        pw.println(s);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            // Creo la nueva configuracion con los datos enviados en la petición
            String nombre = request.getParameter("nombre");
            int nave = Integer.parseInt(request.getParameter("nave"));
            String sonido = request.getParameter("sonido");

            Configuracion nuevaConfiguracion = new Configuracion();
            nuevaConfiguracion.setNombre(nombre);
            nuevaConfiguracion.setNave(nave);
            nuevaConfiguracion.setSonido(sonido);

            // Leo la lista de configuraciones del config.json
            ServletContext context = getServletContext();
            String fullPath = context.getRealPath("/config.json");

            //Gson gson = new Gson();
            Gson gson = new GsonBuilder()
                    .setPrettyPrinting()
                    .disableHtmlEscaping()
                    .create();
            Type listType = new TypeToken<List<Configuracion>>() {
            }.getType();
            List<Configuracion> listaConfiguraciones = gson.fromJson(new FileReader(fullPath), listType);
            /*
            O tambien...            
            JsonReader reader = new JsonReader(new FileReader(fullPath));
            List<Configuracion> listaConfiguraciones = gson.fromJson(reader, listType);
            */

            // Añado la nueva configuracion a la lista
            listaConfiguraciones.add(nuevaConfiguracion);

            //Convierto la lista a archivo json
            FileWriter writer = new FileWriter(fullPath);
            gson.toJson(listaConfiguraciones, writer);
            writer.close();

            response.setContentType("application/json");
            PrintWriter pw = response.getWriter();
            pw.println("{\"mess\":\"La configuración se ha guardado correctamente\"}");

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            PrintWriter pw = response.getWriter();
            pw.println("{\"error\":\"Ha sido imposible guardar los datos\"}");

        }
    }

}
