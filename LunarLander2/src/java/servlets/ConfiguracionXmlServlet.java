/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.JAXB;
import jaxbpackage.JaxbClass;
import configuraciones.Configuraciones;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;


public class ConfiguracionXmlServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        try {
            //Crear objeto File (ponerlo en f)
            ServletContext context = getServletContext();
            String fullPath = context.getRealPath("/config.xml");
            File f = new File(fullPath);

            //parse xml to object (Configuraciones, previamente creado con JAXB)
            //parsear el fichero (pasarlo a lista de Configuraciones)
            // JaxbClass es troba al paquet jaxbpackage
            JaxbClass jaxb = new JaxbClass();
            // Creamos la instancia conf de la clase Configuraciones a partir del archivo xml
            Configuraciones conf = jaxb.xmlToObject(f);
            
            // Hacemos el marshall del objeto
            StringWriter sw = new StringWriter();
            JAXB.marshal(conf, sw);
            String xmlString = sw.toString();

            //Enviamos el string con la respuesta
            response.setContentType("text/xml");
            PrintWriter pw = response.getWriter();
            pw.println(xmlString);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            PrintWriter pw = response.getWriter();
            pw.println("{\"error\":\"Ha sido imposible recuperar los datos\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            String nombre = request.getParameter("nombre");
            byte nave = (byte) Integer.parseInt(request.getParameter("nave"));
            String sonido = request.getParameter("sonido");

            ServletContext context = getServletContext();
            String fullPath = context.getRealPath("/config.xml");
            File f = new File(fullPath);

            //parsear el fichero (pasarlo a lista de Configuraciones)
            JaxbClass jaxb = new JaxbClass();
            Configuraciones conf = jaxb.xmlToObject(f);

            Configuraciones.Configuracion nuevaConfiguracion = new Configuraciones.Configuracion();

            nuevaConfiguracion.setNombre(nombre);
            nuevaConfiguracion.setNave(nave);
            nuevaConfiguracion.setSonido(sonido);
            conf.getConfiguracion().add(nuevaConfiguracion);
            
            jaxb.objectToXml(conf, f);
            
            response.setContentType("application/json");
            PrintWriter pw = response.getWriter();
            pw.println("{\"mess\":\"La configuración se ha guardado correctamente\"}");
        
        } catch (JAXBException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            PrintWriter pw = response.getWriter();
            pw.println("{\"error\":\"Ha sido imposible guardar los datos\"}");

        }
    }
}
