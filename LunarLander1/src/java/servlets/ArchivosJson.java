/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.RandomAccessFile;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author windeveloper
 */
public class ArchivosJson extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException { //For this example j.json is written in one line 
        try {
            //Get absolute path from root web path /WebContent/* 
            ServletContext context = getServletContext();
            String fullPath = context.getRealPath("/conf.json");
            /*
            // Para comprobar el tratamiento de excepciones cambio el nombre del .json por uno que no existe            
            String fullPath = context.getRealPath("/noExisto.json");
             */
            //Create File object 
            File f = new File(fullPath);
            // Se abre el flux (stream) d'informació entre el programa i el fitxer.
            FileReader fr = new FileReader(f);
            BufferedReader br = new BufferedReader(fr);
            // Lee la 1a linea del buffer
            String str = br.readLine();
            String jsonString = "";
            while (str != null) {
                // Añado la 1a linea al String que retorna el metodo
                jsonString += str + "\r\n";
                // Leo la siguiente linea
                str = br.readLine();
            }
            br.close();
            fr.close();

            response.setContentType("application/json");
            PrintWriter pw = response.getWriter();
            pw.print(jsonString);
        } catch (Exception e) {
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
            String nave = request.getParameter("nave");
            ServletContext context = getServletContext();
            String fullPath = context.getRealPath("/conf.json");

            String filecontent = "{\"nave\":\"" + nave + "\"}";

            //Create File object 
            File f = new File(fullPath);
            FileWriter fw = new FileWriter(f);
            fw.write(filecontent);
            fw.close();
            response.setContentType("application/json");
            PrintWriter pw = response.getWriter();
            pw.println("{\"mess\":\"El fichero ha sido guardado correctamente\"}");

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            PrintWriter pw = response.getWriter();
            pw.println("{\"error\":\"Ha sido imposible guardar los datos\"}");
        }
    }

}
