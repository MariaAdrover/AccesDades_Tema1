package configuraciones;

import java.util.ArrayList;

public class Configuraciones {
    private ArrayList<Configuracion> configuraciones;

    public ArrayList<Configuracion> getConfiguraciones() {
        return configuraciones;
    }

    public void setConfiguraciones(ArrayList<Configuracion> configuraciones) {
        this.configuraciones = configuraciones;
    }
    
    public void addConfiguracion(Configuracion confi) {
        this.configuraciones.add(confi);
    }
}
