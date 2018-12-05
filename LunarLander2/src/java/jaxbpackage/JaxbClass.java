/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package jaxbpackage;

import configuraciones.Configuraciones;
import java.io.File;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

/**
 *
 * @author windeveloper
 */
public class JaxbClass {

    public void objectToXml(Configuraciones prs, File rf) throws JAXBException {
        JAXBContext jaxbContext = JAXBContext.newInstance(Configuraciones.class);
        Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
        jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);

        //Do the job
        jaxbMarshaller.marshal(prs, rf);

    }

    public Configuraciones xmlToObject(File f) throws JAXBException {
        JAXBContext jaxbContext = JAXBContext.newInstance(Configuraciones.class);
        Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();

        //Do the job, return object
        return (Configuraciones) jaxbUnmarshaller.unmarshal(f);
    }

}
